BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[faq] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [question] TEXT,
    [answer] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [faq_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [faq_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contact_us] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [type] TEXT,
    [description] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [contact_us_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [contact_us_pkey] PRIMARY KEY CLUSTERED ([id])
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
