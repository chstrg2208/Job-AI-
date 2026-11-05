Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "E:\Job\Quy Trình\Step Author\HOW TO WAY AUTHORIZE.docx"
$archive = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $archive.GetEntry('word/document.xml')
$stream = $entry.Open()
$sr = New-Object System.IO.StreamReader($stream)
$xmlContent = $sr.ReadToEnd()
$sr.Close()
$stream.Close()
$archive.Dispose()
[xml]$xml = $xmlContent
$xml.Document.body.p | ForEach-Object { $_.InnerText }
