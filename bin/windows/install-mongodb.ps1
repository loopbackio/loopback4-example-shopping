#
# MongoDB (as a windows service)
#
$mongoDbPath = "$env:SystemDrive\MongoDB"
$mongoDbConfigPath = "$mongoDbPath\mongod.cfg"
$url = "https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-3.2.7.zip"
$zipFile = "$mongoDbPath\mongo.zip"
$unzippedFolderContent ="$mongoDbPath\mongodb-win32-x86_64-2008plus-3.2.7"

if ((Test-Path -path $mongoDbPath) -eq $false)
{
	Write-Host "Setting up directories..."
	$temp = md $mongoDbPath
	$temp = md "$mongoDbPath\log"
	$temp = md "$mongoDbPath\data"
	$temp = md "$mongoDbPath\data\db"

	Write-Host "Setting up mongod.cfg..."
	[System.IO.File]::AppendAllText("$mongoDbConfigPath", "dbpath=$mongoDbPath\data\db`r`n")
	[System.IO.File]::AppendAllText("$mongoDbConfigPath", "logpath=$mongoDbPath\log\mongo.log`r`n")
	[System.IO.File]::AppendAllText("$mongoDbConfigPath", "smallfiles=true`r`n")

	Write-Host "Downloading MongoDB..."
	$webClient = New-Object System.Net.WebClient
	$webClient.DownloadFile($url,$zipFile)

	Write-Host "Unblock zip file..."
	Get-ChildItem -Path $mongoDbPath -Recurse | Unblock-File

	Write-Host "Unzipping Mongo files..."
	$shellApp = New-Object -com shell.application
	$destination = $shellApp.namespace($mongoDbPath)
	$destination.Copyhere($shellApp.namespace($zipFile).items())

	Copy-Item "$unzippedFolderContent\*" $mongoDbPath -recurse

	Write-Host "Cleaning up..."
	Remove-Item $unzippedFolderContent -recurse -force
	Remove-Item $zipFile -recurse -force

	Write-Host "Installing Mongod as a service..."
	& $mongoDBPath\bin\mongod.exe --config $mongoDbConfigPath --install

	Write-Host "Starting Mongod..."
	& net start mongodb
}
else {
	Write-Host "MongoDB already installed."
}
