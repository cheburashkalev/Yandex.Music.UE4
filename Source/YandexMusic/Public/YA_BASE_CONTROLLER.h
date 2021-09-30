// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "YA_BASE_CONTROLLER.generated.h"

/**
 * 
 */
UCLASS()
class YANDEXMUSIC_API AYA_BASE_CONTROLLER : public APlayerController
{
	GENERATED_BODY()
protected:
	// Called when the game starts
	virtual void BeginPlay() override;
	
};
