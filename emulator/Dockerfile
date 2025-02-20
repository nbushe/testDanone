FROM mcr.microsoft.com/dotnet/sdk:8.0.303 AS build
WORKDIR /app
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o out
RUN dotnet publish -c Release -o out
EXPOSE 5234
CMD ["dotnet", "out/emulator.dll"]

