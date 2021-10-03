// Copyright 2021 RLoris

#include "ScreenshotUtility.h"
#include <Runtime/Engine/Public/ImageUtils.h>


UScreenshotUtility* UScreenshotUtility::TakeScreenshot(UObject* WorldContextObject, FString Filename, bool PrefixTimestamp, bool ShowUI)
{
	UScreenshotUtility* Node = NewObject<UScreenshotUtility>();
	Node->Active = false;
	Node->WorldContextObject = WorldContextObject;
	Node->ShowUI = ShowUI;
	Node->Filename = FPaths::GetCleanFilename(Filename);
	Node->PrefixTimestamp = PrefixTimestamp;
	// not garbage collected
	// Node->RegisterWithGameInstance(WorldContextObject);
	return Node;
}

void UScreenshotUtility::Activate()
{
	if (nullptr == this->WorldContextObject)
	{
		FFrame::KismetExecutionMessage(TEXT("Invalid WorldContextObject. Cannot execute ScreenshotUtility"), ELogVerbosity::Error);
		this->_Failed();
		return;
	}
	if (this->Active)
	{
		FFrame::KismetExecutionMessage(TEXT("ScreenshotUtility is already running"), ELogVerbosity::Warning);
		this->_Failed();
		return;
	}
	IPlatformFile& file = FPlatformFileManager::Get().GetPlatformFile();
	FText ErrorFilename;
	if (!FFileHelper::IsFilenameValidForSaving(this->Filename, ErrorFilename))
	{
		FFrame::KismetExecutionMessage(TEXT("Filename is not valid"), ELogVerbosity::Warning);
		this->_Failed();
		return;
	}
	this->Active = true;
	FString FinalFilename = (this->PrefixTimestamp ? (FDateTime::Now().ToString(TEXT("%Y_%m_%d__%H_%M_%S__"))) : "") + this->Filename;
	FScreenshotRequest::RequestScreenshot(FinalFilename, this->ShowUI, false);
	if (FScreenshotRequest::IsScreenshotRequested())
	{
		FString FilePath = FScreenshotRequest::GetFilename();
		FScreenshotRequest::OnScreenshotRequestProcessed().AddUObject(this, &UScreenshotUtility::_Completed, FilePath);
	}
}

void UScreenshotUtility::_Completed(FString Path)
{
	IPlatformFile& file = FPlatformFileManager::Get().GetPlatformFile();
	if (file.FileExists(*Path)) 
	{
		UTexture2D* Tex = FImageUtils::ImportFileAsTexture2D(Path);
		Completed.Broadcast(Tex, Path);
	}
	else 
	{
		Failed.Broadcast(nullptr, "");
	}
	this->Active = false;
	FScreenshotRequest::OnScreenshotRequestProcessed().RemoveAll(this);
	// this->SetReadyToDestroy();
}

void UScreenshotUtility::_Failed()
{
	Failed.Broadcast(nullptr, "");
	this->Active = false;
	FScreenshotRequest::OnScreenshotRequestProcessed().RemoveAll(this);
	// this->SetReadyToDestroy();
}