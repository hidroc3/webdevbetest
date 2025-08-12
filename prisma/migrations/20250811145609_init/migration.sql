BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [user_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [user_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[permission] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [permission_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[user_has_role] (
    [user_id] BIGINT NOT NULL,
    [role_id] BIGINT NOT NULL,
    CONSTRAINT [user_has_role_pkey] PRIMARY KEY CLUSTERED ([user_id],[role_id])
);

-- CreateTable
CREATE TABLE [dbo].[role_has_permission] (
    [role_id] BIGINT NOT NULL,
    [permission_id] BIGINT NOT NULL,
    CONSTRAINT [role_has_permission_pkey] PRIMARY KEY CLUSTERED ([role_id],[permission_id])
);

-- CreateTable
CREATE TABLE [dbo].[cctv] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [ip] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [cctv_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [cctv_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[province] (
    [id] BIGINT NOT NULL,
    [name] NVARCHAR(1000),
    CONSTRAINT [province_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[city] (
    [id] BIGINT NOT NULL,
    [name] NVARCHAR(1000),
    [provinceId] BIGINT NOT NULL,
    CONSTRAINT [city_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sub_district] (
    [id] BIGINT NOT NULL,
    [name] NVARCHAR(1000),
    [cityId] BIGINT NOT NULL,
    CONSTRAINT [sub_district_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[village] (
    [id] BIGINT NOT NULL,
    [name] NVARCHAR(1000),
    [subDistrictId] BIGINT NOT NULL,
    CONSTRAINT [village_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[das] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    CONSTRAINT [das_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[aws_stations] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [device_id] NVARCHAR(1000),
    [managed_by] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    [dasId] BIGINT,
    [time] DATETIME2,
    [rainfall] FLOAT(53),
    [air_temperature_avg] FLOAT(53),
    [relative_humidity] FLOAT(53),
    [wind_speed] FLOAT(53),
    [wind_direction] FLOAT(53),
    [solar_radiation_avg] FLOAT(53),
    [battery] FLOAT(53),
    [panel_temperature] FLOAT(53),
    [image] NVARCHAR(1000),
    [villageId] BIGINT,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [built_by] NVARCHAR(1000),
    [built_year] NVARCHAR(1000),
    [renovated_by] NVARCHAR(1000),
    [renovated_year] NVARCHAR(1000),
    [alert_level_1] INT,
    [alert_level_2] INT,
    [alert_level_3] INT,
    [alert_level_4] INT,
    [status] NVARCHAR(1000),
    CONSTRAINT [aws_stations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [aws_stations_device_id_key] UNIQUE NONCLUSTERED ([device_id])
);

-- CreateTable
CREATE TABLE [dbo].[aws_logs] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [aws_station_id] BIGINT,
    [time] DATETIME2,
    [rainfall] FLOAT(53),
    [air_temperature_avg] FLOAT(53),
    [relative_humidity] FLOAT(53),
    [wind_speed] FLOAT(53),
    [wind_direction] FLOAT(53),
    [solar_radiation_avg] FLOAT(53),
    [battery] FLOAT(53),
    [status] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    CONSTRAINT [aws_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[awlr_stations] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [device_id] NVARCHAR(1000),
    [managed_by] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    [dasId] BIGINT,
    [river_name] NVARCHAR(1000),
    [time] DATETIME2,
    [water_level] FLOAT(53),
    [battery] FLOAT(53),
    [panel_temperature] FLOAT(53),
    [image] NVARCHAR(1000),
    [flow_ho] FLOAT(53),
    [flow_a] FLOAT(53),
    [flow_b] FLOAT(53),
    [debit] FLOAT(53),
    [villageId] BIGINT,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [built_by] NVARCHAR(1000),
    [built_year] NVARCHAR(1000),
    [renovated_by] NVARCHAR(1000),
    [renovated_year] NVARCHAR(1000),
    [alert_level_1] INT,
    [alert_level_2] INT,
    [alert_level_3] INT,
    [alert_level_4] INT,
    [status] NVARCHAR(1000),
    CONSTRAINT [awlr_stations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [awlr_stations_device_id_key] UNIQUE NONCLUSTERED ([device_id])
);

-- CreateTable
CREATE TABLE [dbo].[awlr_logs] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [awlr_station_id] BIGINT,
    [time] DATETIME2,
    [water_level] FLOAT(53),
    [debit] FLOAT(53),
    [battery] FLOAT(53),
    [panel_temperature] FLOAT(53),
    [status] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    CONSTRAINT [awlr_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[arr_stations] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [device_id] NVARCHAR(1000),
    [managed_by] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    [dasId] BIGINT,
    [time] DATETIME2,
    [rainfall] FLOAT(53),
    [battery] FLOAT(53),
    [panel_temperature] FLOAT(53),
    [image] NVARCHAR(1000),
    [villageId] BIGINT,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [built_by] NVARCHAR(1000),
    [built_year] NVARCHAR(1000),
    [renovated_by] NVARCHAR(1000),
    [renovated_year] NVARCHAR(1000),
    [alert_level_1] INT,
    [alert_level_2] INT,
    [alert_level_3] INT,
    [alert_level_4] INT,
    [status] NVARCHAR(1000),
    CONSTRAINT [arr_stations_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [arr_stations_device_id_key] UNIQUE NONCLUSTERED ([device_id])
);

-- CreateTable
CREATE TABLE [dbo].[arr_logs] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [arr_station_id] BIGINT,
    [time] DATETIME2,
    [rainfall] FLOAT(53),
    [battery] FLOAT(53),
    [panel_temperature] FLOAT(53),
    [status] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    CONSTRAINT [arr_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contact_wa] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [phone_number] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [type] NVARCHAR(1000),
    CONSTRAINT [contact_wa_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[message_wa] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [contact_id] BIGINT,
    [messageText] TEXT,
    [created_at] DATETIME2,
    CONSTRAINT [message_wa_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[arr_log_manuals] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] BIGINT,
    [arr_id] BIGINT,
    [time] NVARCHAR(1000),
    [date] DATETIME2,
    [value] FLOAT(53),
    [unit] NVARCHAR(1000),
    CONSTRAINT [arr_log_manuals_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[awlr_log_manuals] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] BIGINT,
    [awlr_id] BIGINT,
    [time] NVARCHAR(1000),
    [date] DATETIME2,
    [value] FLOAT(53),
    [unit] NVARCHAR(1000),
    CONSTRAINT [awlr_log_manuals_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[aws_log_manuals] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] BIGINT,
    [aws_id] BIGINT,
    [time] NVARCHAR(1000),
    [date] DATETIME2,
    [value] FLOAT(53),
    [unit] NVARCHAR(1000),
    CONSTRAINT [aws_log_manuals_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[post_guards] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] BIGINT,
    [name] NVARCHAR(1000),
    [post_name] NVARCHAR(1000),
    [type_pos] NVARCHAR(1000),
    [photo] NVARCHAR(1000),
    [time] NVARCHAR(1000),
    [date] DATETIME2,
    [value] FLOAT(53),
    [unit] NVARCHAR(1000),
    [manual_positions_id] BIGINT,
    CONSTRAINT [post_guards_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[post_hydrologic] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [type_pos] NVARCHAR(1000),
    CONSTRAINT [post_hydrologic_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[report] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [category] NVARCHAR(1000),
    CONSTRAINT [report_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[report_details] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [category_id] BIGINT,
    [title] NVARCHAR(1000),
    [news] NVARCHAR(1000),
    [date] DATETIME2,
    [status] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    CONSTRAINT [report_details_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[hydrology_requests] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [institution] NVARCHAR(1000),
    [uploaded_letter] NVARCHAR(1000),
    [feedback] NVARCHAR(1000),
    CONSTRAINT [hydrology_requests_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[hydraulic_output_hecras] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [hydrologic_output_id] BIGINT,
    [time] DATETIME2,
    [flood_depth] FLOAT(53),
    [flow_velocity] FLOAT(53),
    [inundation_area] FLOAT(53),
    [model_type] NVARCHAR(1000),
    [model_version] NVARCHAR(1000),
    [parameter_set] NVARCHAR(1000),
    [village_id] BIGINT,
    CONSTRAINT [hydraulic_output_hecras_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[hydrologic_output_hechms] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [das_id] BIGINT,
    [time] DATETIME2,
    [debit] FLOAT(53),
    [volume] FLOAT(53),
    [model_type] NVARCHAR(1000),
    [model_version] NVARCHAR(1000),
    [parameter_set] NVARCHAR(1000),
    [awlr_station_id] BIGINT,
    [aws_station_id] BIGINT,
    [arr_station_id] BIGINT,
    CONSTRAINT [hydrologic_output_hechms_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [driver_name] NVARCHAR(1000),
    [driver_phone] NVARCHAR(1000),
    [registration] NVARCHAR(1000),
    [chassis_number] NVARCHAR(1000),
    [time] DATETIME2,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [position_description] NVARCHAR(1000),
    [speed] FLOAT(53),
    [bearing] INT,
    [vehicle_status] BIT CONSTRAINT [vehicle_vehicle_status_df] DEFAULT 1,
    [idling] BIT CONSTRAINT [vehicle_idling_df] DEFAULT 1,
    [odometer] BIGINT,
    [altitude] FLOAT(53),
    [fuel_level] FLOAT(53),
    [fuel_percentage] FLOAT(53),
    [created_at] DATETIME2,
    CONSTRAINT [vehicle_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vehicle_registration_key] UNIQUE NONCLUSTERED ([registration])
);

-- CreateTable
CREATE TABLE [dbo].[vehicle_tracking_logs] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [vehicle_id] BIGINT,
    [registration] NVARCHAR(1000),
    [chassis_number] NVARCHAR(1000),
    [time] DATETIME2,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [position_description] NVARCHAR(1000),
    [speed] FLOAT(53),
    [bearing] INT,
    [vehicle_status] BIT,
    [idling] BIT,
    [odometer] BIGINT,
    [altitude] FLOAT(53),
    [fuel_level] FLOAT(53),
    [fuel_percentage] FLOAT(53),
    [created_at] DATETIME2,
    CONSTRAINT [vehicle_tracking_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sirine] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [device_name] NVARCHAR(1000),
    [firmware_version] NVARCHAR(1000),
    [status_logger] NVARCHAR(1000),
    [last_comm_success] DATETIME2,
    [is_active] BIT,
    [outdated_alarm_status] NVARCHAR(1000),
    [outdated_data_time] DATETIME2,
    [battery_voltage] FLOAT(53),
    [battery_unit] NVARCHAR(1000),
    [battery_status_alarm] NVARCHAR(1000),
    [on_control_value] INT,
    [on_control_state] NVARCHAR(1000),
    [off_control_value] INT,
    [off_control_state] NVARCHAR(1000),
    [on_control_state_id] NVARCHAR(1000),
    [on_control_url] NVARCHAR(1000),
    [off_control_state_id] NVARCHAR(1000),
    [off_control_url] NVARCHAR(1000),
    [is_sirine_on] BIT CONSTRAINT [sirine_is_sirine_on_df] DEFAULT 0,
    [updated_at] DATETIME2,
    CONSTRAINT [sirine_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[user_has_role] ADD CONSTRAINT [user_has_role_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[user_has_role] ADD CONSTRAINT [user_has_role_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_has_permission] ADD CONSTRAINT [role_has_permission_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_has_permission] ADD CONSTRAINT [role_has_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[city] ADD CONSTRAINT [city_provinceId_fkey] FOREIGN KEY ([provinceId]) REFERENCES [dbo].[province]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[sub_district] ADD CONSTRAINT [sub_district_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[city]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[village] ADD CONSTRAINT [village_subDistrictId_fkey] FOREIGN KEY ([subDistrictId]) REFERENCES [dbo].[sub_district]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[aws_stations] ADD CONSTRAINT [aws_stations_dasId_fkey] FOREIGN KEY ([dasId]) REFERENCES [dbo].[das]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[aws_logs] ADD CONSTRAINT [aws_logs_aws_station_id_fkey] FOREIGN KEY ([aws_station_id]) REFERENCES [dbo].[aws_stations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[awlr_stations] ADD CONSTRAINT [awlr_stations_dasId_fkey] FOREIGN KEY ([dasId]) REFERENCES [dbo].[das]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[awlr_logs] ADD CONSTRAINT [awlr_logs_awlr_station_id_fkey] FOREIGN KEY ([awlr_station_id]) REFERENCES [dbo].[awlr_stations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[arr_stations] ADD CONSTRAINT [arr_stations_dasId_fkey] FOREIGN KEY ([dasId]) REFERENCES [dbo].[das]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[arr_logs] ADD CONSTRAINT [arr_logs_arr_station_id_fkey] FOREIGN KEY ([arr_station_id]) REFERENCES [dbo].[arr_stations]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[message_wa] ADD CONSTRAINT [message_wa_contact_id_fkey] FOREIGN KEY ([contact_id]) REFERENCES [dbo].[contact_wa]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[arr_log_manuals] ADD CONSTRAINT [arr_log_manuals_arr_id_fkey] FOREIGN KEY ([arr_id]) REFERENCES [dbo].[post_hydrologic]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[arr_log_manuals] ADD CONSTRAINT [arr_log_manuals_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[awlr_log_manuals] ADD CONSTRAINT [awlr_log_manuals_awlr_id_fkey] FOREIGN KEY ([awlr_id]) REFERENCES [dbo].[post_hydrologic]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[awlr_log_manuals] ADD CONSTRAINT [awlr_log_manuals_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[aws_log_manuals] ADD CONSTRAINT [aws_log_manuals_aws_id_fkey] FOREIGN KEY ([aws_id]) REFERENCES [dbo].[post_hydrologic]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[aws_log_manuals] ADD CONSTRAINT [aws_log_manuals_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[post_guards] ADD CONSTRAINT [post_guards_manual_positions_id_fkey] FOREIGN KEY ([manual_positions_id]) REFERENCES [dbo].[post_hydrologic]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[post_guards] ADD CONSTRAINT [post_guards_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[report_details] ADD CONSTRAINT [report_details_category_id_fkey] FOREIGN KEY ([category_id]) REFERENCES [dbo].[report]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[hydraulic_output_hecras] ADD CONSTRAINT [hydraulic_output_hecras_hydrologic_output_id_fkey] FOREIGN KEY ([hydrologic_output_id]) REFERENCES [dbo].[hydrologic_output_hechms]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[hydraulic_output_hecras] ADD CONSTRAINT [hydraulic_output_hecras_village_id_fkey] FOREIGN KEY ([village_id]) REFERENCES [dbo].[village]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[hydrologic_output_hechms] ADD CONSTRAINT [hydrologic_output_hechms_arr_station_id_fkey] FOREIGN KEY ([arr_station_id]) REFERENCES [dbo].[arr_stations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hydrologic_output_hechms] ADD CONSTRAINT [hydrologic_output_hechms_awlr_station_id_fkey] FOREIGN KEY ([awlr_station_id]) REFERENCES [dbo].[awlr_stations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hydrologic_output_hechms] ADD CONSTRAINT [hydrologic_output_hechms_aws_station_id_fkey] FOREIGN KEY ([aws_station_id]) REFERENCES [dbo].[aws_stations]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[hydrologic_output_hechms] ADD CONSTRAINT [hydrologic_output_hechms_das_id_fkey] FOREIGN KEY ([das_id]) REFERENCES [dbo].[das]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vehicle_tracking_logs] ADD CONSTRAINT [vehicle_tracking_logs_vehicle_id_fkey] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[vehicle]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
