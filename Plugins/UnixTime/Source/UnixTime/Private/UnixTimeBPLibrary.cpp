// Copyright 1998-2019 Epic Games, Inc. All Rights Reserved.

#include "UnixTimeBPLibrary.h"
#include "UnixTime.h"
#include <iomanip>
#include <iostream>
#include <cstdint>
#include <math.h>
#include <stdio.h>
#include <chrono>


UUnixTimeBPLibrary::UUnixTimeBPLibrary(const FObjectInitializer& ObjectInitializer)
: Super(ObjectInitializer)
{

}
void reverse(char* str, int len)
{
	int i = 0, j = len - 1, temp;
	while (i < j) {
		temp = str[i];
		str[i] = str[j];
		str[j] = temp;
		i++;
		j--;
	}
}
int intToStr(int x, char str[], int d)

{
	int i = 0;
	while (x) {
		str[i++] = (x % 10) + '0';
		x = x / 10;
	}
	// ���� ��������� ���������� ���� ������, ��
	// ��������� 0 � ������
	while (i < d)
		str[i++] = '0';
	reverse(str, i);
	str[i] = '\0';
	return i;
}
void ftoa(float n, char* res, int afterpoint)

{
	// ��������� ����� �����
	int ipart = (int)n;
	// ������� ��������� �����
	float fpart = n - (float)ipart;
	// ������������� ����� ����� � ������
	int i = intToStr(ipart, res, 1);
	// �������� ����� ����������� ����� �����
	if (afterpoint != 0) {
		res[i] = '.'; // �������� �����
		// �������� �������� ������� ����� �� ��������� ������.
		// ����� ����� ����� ������ ��������
		// ��������� ��� ��������� �������, ����� ��� 233.007
		fpart = fpart * pow(10, afterpoint);
		intToStr((int)fpart, res + i + 1, afterpoint);
	}
}


int UUnixTimeBPLibrary::UnixToUE4(FDateTime Param)
{
	//return Param.ToUnixTimestamp();
	return Param.ToUnixTimestamp();
}
FDateTime UUnixTimeBPLibrary::UE4ToUnix(int Param) 
{
	//FromUnixTimestamp(Param);
	return FDateTime::FromUnixTimestamp(Param);
}
FString UUnixTimeBPLibrary::FloatText(float param,int Zepytay) 
{

		char res[20];
		
		ftoa(param, res, Zepytay);
		
		return FString(res);

	
}


