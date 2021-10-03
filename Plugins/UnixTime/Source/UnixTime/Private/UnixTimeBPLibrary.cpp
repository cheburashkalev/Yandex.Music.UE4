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
	// Если требуемое количество цифр больше, то
	// добавляем 0 в начале
	while (i < d)
		str[i++] = '0';
	reverse(str, i);
	str[i] = '\0';
	return i;
}
void ftoa(float n, char* res, int afterpoint)

{
	// Извлекаем целую часть
	int ipart = (int)n;
	// Извлечь плавающую часть
	float fpart = n - (float)ipart;
	// преобразовать целую часть в строку
	int i = intToStr(ipart, res, 1);
	// проверка опции отображения после точки
	if (afterpoint != 0) {
		res[i] = '.'; // добавить точку
		// Получить значение дробной части до заданного номера.
		// точек после точки Третий параметр
		// необходим для обработки случаев, таких как 233.007
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


