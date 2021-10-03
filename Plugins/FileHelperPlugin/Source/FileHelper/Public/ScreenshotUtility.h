// Copyright 2021 RLoris

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintAsyncActionBase.h"
#include "UnrealClient.h"
#include "ScreenshotUtility.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOutputPin, UTexture2D*, Screenshot, FString, Path);

/**
 * 
 */
UCLASS()
class FILEHELPER_API UScreenshotUtility : public UBlueprintAsyncActionBase
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintAssignable)
	FOutputPin Completed;
	UPROPERTY(BlueprintAssignable)
	FOutputPin Failed;

public:
	UFUNCTION(BlueprintCallable, meta = (BlueprintInternalUseOnly = "true", WorldContext = "WorldContextObject"), Category = "Image")
	static UScreenshotUtility* TakeScreenshot(UObject* WorldContextObject, FString Filename, bool PrefixTimestamp = true, bool ShowUI = false);
	virtual void Activate() override;
	
private:
	UFUNCTION()
	void _Completed(FString Path);
	void _Failed();

private:
	const UObject* WorldContextObject = nullptr;
	bool Active = false;
	FString Filename;
	bool PrefixTimestamp = true;
	bool ShowUI = false;
};
