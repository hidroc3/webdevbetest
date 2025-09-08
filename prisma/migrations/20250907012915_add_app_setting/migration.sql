BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[app_setting] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [key] NVARCHAR(1000) NOT NULL,
    [value] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [app_setting_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [app_setting_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [app_setting_key_key] UNIQUE NONCLUSTERED ([key])
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
