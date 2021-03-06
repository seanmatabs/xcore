/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [LOGDATETIME] as Time
	  ,[NAME_] as DeviceName
	  ,[FIRSTNAME] as FirstName
	  ,[LASTNAME] as LastName
	  ,[EMPLOYEEID] as CardNumber
      ,[JOBTITLE] as JobTitle
  FROM [MorphoManager].[dbo].[AccessLog]
   JOIN [MorphoManager].[dbo].[User_] ON [MorphoManager].[dbo].[AccessLog].[USERID]=[MorphoManager].[dbo].[User_].ID
   JOIN [MorphoManager].[dbo].BiometricDevice ON [MorphoManager].[dbo].AccessLog.MORPHOACCESSID = [MorphoManager].[dbo].[BiometricDevice].ID