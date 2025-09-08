BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[sih3] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [title] TEXT,
    [description] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [sih3_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [sih3_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sih3_item] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [logo_path] TEXT,
    [title] TEXT,
    [description] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [sih3_item_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [sih3_item_pkey] PRIMARY KEY CLUSTERED ([id])
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
