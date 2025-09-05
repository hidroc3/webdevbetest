import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMessageWaDto } from './dto/create-message-wa.dto';
import { UpdateMessageWaDto } from './dto/update-message-wa.dto';
import { ApiWaBlastingService } from '../api-wa-blasting/api-wa-blasting.service';
import { Prisma } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

type StationWithLogs = Prisma.AwlrStationGetPayload<{
  include: { logs: true };
}>;

function getDateTimeSlot() {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
  );

  const currentHour = jakartaTime.getHours();
  const endHour = currentHour;
  let startHour = currentHour - 3;

  if (startHour < 0) {
    startHour = 21;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  const time = `${pad(endHour)}:00`;
  const date = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(now);

  return { date, time };
}

@Injectable()
export class MessageWaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiWaBlastingService: ApiWaBlastingService,
  ) {}

  async create(dto: CreateMessageWaDto) {
    const created = await this.prisma.messageWa.create({ data: dto });

    // Ambil semua kontak dari contact-wa
    const contacts = await this.prisma.contactWa.findMany();

    for (const contact of contacts) {
      if (contact.phoneNumber && dto.messageText) {
        await this.apiWaBlastingService
          .sendMessage({
            phoneNumber: contact.phoneNumber,
            message: dto.messageText,
          })
          .then(() => {
            console.log(`WA sent to ${contact.name}`);
          })
          .catch((error) => {
            console.error(`Failed to send WA to ${contact.name}:`, error);
          });
      }
    }

    return {
      message: 'Message saved and sent to all contacts',
      data: created,
    };
  }

  async findAll() {
    const messages = await this.prisma.messageWa.findMany();
    return {
      message: 'All messages retrieved',
      data: messages,
    };
  }

  async findOne(id: number) {
    const message = await this.prisma.messageWa.findUnique({ where: { id } });
    return {
      message: 'Message detail retrieved',
      data: message,
    };
  }

  async update(id: number, data: UpdateMessageWaDto) {
    const updated = await this.prisma.messageWa.update({
      where: { id },
      data,
    });
    return {
      message: 'Message updated',
      data: updated,
    };
  }

  async remove(id: number) {
    const deleted = await this.prisma.messageWa.delete({ where: { id } });
    return {
      message: 'Message deleted',
      data: deleted,
    };
  }

  @Cron('0 0 */3 * * *', {
    timeZone: 'Asia/Jakarta',
    // Setiap 3 jam
  })
  async scheduleWa() {
    const { date, time } = getDateTimeSlot();

    // AWLR
    const awlrStations = await this.prisma.awlrStation.findMany({
      where: {
        is_active: true,
      },
      include: {
        logs: {
          orderBy: {
            time: 'desc',
          },
          take: 2,
        },
      },
    });

    const totalAwlrStations = awlrStations.reduce(
      (acc, station) => {
        if (station.status) {
          acc[station.status.toLowerCase()]++;
        }
        return acc;
      },
      { normal: 0, siaga: 0, waspada: 0, awas: 0 },
    );

    const groupByStatusAwlr = {
      Normal: [],
      Siaga: [],
      Waspada: [],
      Awas: [],
    } as Record<string, any[]>;

    awlrStations.forEach((station) => {
      if (station.status) {
        groupByStatusAwlr[station.status].push(station);
      }
    });

    function renderSectionAwlr(stations: StationWithLogs[]): string {
      return stations
        .map((st) => {
          const latest = st.logs?.[0];
          const previous = st.logs?.[1];
          const latestLevel = latest?.water_level ?? 0;
          const previousLevel = previous?.water_level ?? 0;

          let trendText = 'Tidak ada data sebelumnya';
          if (latest && previous) {
            const diff = latestLevel - previousLevel;
            if (diff > 0) {
              trendText = `🔼 Naik ${diff.toFixed(2)} m dari periode sebelumnya`;
            } else if (diff < 0) {
              trendText = `🔽 Turun ${Math.abs(diff).toFixed(2)} m dari periode sebelumnya`;
            } else {
              trendText = '➖ Stabil dibanding periode sebelumnya';
            }
          }

          return (
            `• ${st.post_name}\n` +
            `  DAS ${st.river_name}\n` +
            `  TMA: ${st.water_level ?? 0} m\n` +
            `  ${trendText}\n`
          );
        })
        .join('\n');
    }

    const sectionAwlrNormal = `${totalAwlrStations.normal} AWLR (Normal)\n`;
    const sectionAwlrSiaga =
      totalAwlrStations.siaga > 0
        ? `\n${totalAwlrStations.siaga} AWLR (Siaga)\n` +
          '\nSiaga\n' +
          renderSectionAwlr(groupByStatusAwlr.Siaga) +
          '\n'
        : `${totalAwlrStations.siaga} AWLR (Siaga)\n`;
    const sectionAwlrWaspada =
      totalAwlrStations.waspada > 0
        ? `\n${totalAwlrStations.waspada} AWLR (Waspada)\n` +
          '\nWaspada\n' +
          renderSectionAwlr(groupByStatusAwlr.Waspada) +
          '\n'
        : `${totalAwlrStations.waspada} AWLR (Waspada)\n`;
    const sectionAwlrAwas =
      totalAwlrStations.awas > 0
        ? `\n${totalAwlrStations.awas} AWLR (Awas)\n` +
          '\nAwas\n' +
          renderSectionAwlr(groupByStatusAwlr.Awas) +
          '\n'
        : `${totalAwlrStations.awas} AWLR (Awas)\n`;
    // END AWLR

    // ARR
    const arrStations = await this.prisma.arrStation.findMany({
      where: {
        is_active: true,
      },
      include: {
        das: true,
      },
    });

    const totalArrStations = arrStations.reduce(
      (acc, arr) => {
        if (arr.status === 'Berawan') {
          acc.berawan++;
        } else if (arr.status === 'Hujan Ringan') {
          acc.hujan_ringan++;
        } else if (arr.status === 'Hujang Sedang') {
          acc.hujan_sedang++;
        } else if (arr.status === 'Hujan Lebat') {
          acc.hujan_lebat++;
        } else if (arr.status === 'Hujan Sangat Lebat') {
          acc.hujan_sangat_lebat++;
        } else {
          acc.tidak_diketahui++;
        }
        return acc;
      },
      {
        berawan: 0,
        hujan_ringan: 0,
        hujan_sedang: 0,
        hujan_lebat: 0,
        hujan_sangat_lebat: 0,
        tidak_diketahui: 0,
      },
    );

    const groupByStatusArr: Record<string, any[]> = {
      Berawan: [],
      'Hujan Ringan': [],
      'Hujan Sedang': [],
      'Hujan Lebat': [],
      'Hujan Sangat Lebat': [],
      'Tidak Diketahui': [],
    };

    arrStations.forEach((station) => {
      if (station.status) {
        groupByStatusArr[station.status].push(station);
      }
    });

    function renderSectionArr(stations: any[]): string {
      return stations
        .map((st) => {
          return (
            `• ${st.post_name}\n` +
            `  DAS ${st.das?.name ?? '-'}\n` +
            `  Akumulasi CH: ${st.rainfall ?? 0} mm\n` +
            `  Kategori: ${st.status}\n`
          );
        })
        .join('\n');
    }

    const sectionArrHujanRingan =
      totalArrStations.hujan_ringan > 0
        ? `\n${totalArrStations.hujan_ringan} PCH Hujan Ringan:\n` +
          renderSectionArr(groupByStatusArr['Hujan Ringan']) +
          '\n'
        : `${totalArrStations.hujan_ringan} PCH Hujan Ringan\n`;
    const sectionArrHujanSedang =
      totalArrStations.hujan_sedang > 0
        ? `\n${totalArrStations.hujan_sedang} PCH Hujan Sedang:\n` +
          renderSectionArr(groupByStatusArr['Hujan Sedang']) +
          '\n'
        : `${totalArrStations.hujan_sedang} PCH Hujan Sedang\n`;
    const sectionArrHujanLebat =
      totalArrStations.hujan_lebat > 0
        ? `\n${totalArrStations.hujan_lebat} PCH Hujan Lebat:\n` +
          renderSectionArr(groupByStatusArr['Hujan Lebat']) +
          '\n'
        : `${totalArrStations.hujan_lebat} PCH Hujan Lebat\n`;
    const sectionArrHujanSangatLebat =
      totalArrStations.hujan_sangat_lebat > 0
        ? `\n${totalArrStations.hujan_sangat_lebat} PCH Hujan Sangat Lebat:\n` +
          renderSectionArr(groupByStatusArr['Hujan Sangat Ringan']) +
          '\n'
        : `${totalArrStations.hujan_sangat_lebat} PCH Hujan Sangat Lebat\n`;
    // END ARR

    const message =
      '📢 Laporan Hidrologi BBWS C3\n\n' +
      `🗓️ ${date} ⏰ ${time} WIB\n` +
      '\n==========================================\n\n' +
      '🌊 Status AWLR (Tinggi Muka Air)\n\n' +
      sectionAwlrNormal +
      sectionAwlrSiaga +
      sectionAwlrWaspada +
      sectionAwlrAwas +
      '\n==========================================\n\n' +
      '🌧️ Status Curah Hujan\n' +
      sectionArrHujanRingan +
      sectionArrHujanSedang +
      sectionArrHujanLebat +
      sectionArrHujanSangatLebat +
      '\n==========================================\n\n' +
      'Bendungan Sindangheula\n' +
      'BSH-Intake : 105.02 mdpl\n\n' +
      '📲 Info detail lebih lanjut di aplikasi SiRINI-PRAKTIS\n' +
      '👉 https://c3-ffews.sda.pu.go.id\n\n' +
      '👷‍♂️ BBWS C3 INFO';

    const contacts = await this.prisma.contactWa.findMany();
    for (const contact of contacts) {
      if (contact.phoneNumber && message) {
        await this.apiWaBlastingService
          .sendMessage({
            phoneNumber: contact.phoneNumber,
            message: message,
          })
          .then(() => {
            console.log(`WA sent to ${contact.name}`);
          })
          .catch((error) => {
            console.error(`Failed to send WA to ${contact.name}:`, error);
          });
      }
    }

    return;
  }
}
