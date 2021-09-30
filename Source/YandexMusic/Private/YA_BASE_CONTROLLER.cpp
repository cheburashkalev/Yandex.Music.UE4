// Fill out your copyright notice in the Description page of Project Settings.


#include "YA_BASE_CONTROLLER.h"
#include "Misc/App.h"
void AYA_BASE_CONTROLLER::BeginPlay()
{
	Super::BeginPlay();
	FApp::SetUnfocusedVolumeMultiplier(1);
	return;
}