BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[hero] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [rich_text] TEXT,
    [cta_text] TEXT,
    [cta_link] TEXT,
    [image_path] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [hero_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [hero_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
