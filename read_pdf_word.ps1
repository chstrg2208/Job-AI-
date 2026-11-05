$word = New-Object -ComObject Word.Application
$word.Visible = $false
$files = Get-ChildItem 'E:\Job\Quy Trình\*.pdf'
foreach ($f in $files) {
    if ($f.Name -match 'GỬI KHÁCH|ĐỔI NPN|UNLOCK|HỖ TRỢ|Second|TẠO CONTACT') {
        try {
            $doc = $word.Documents.Open($f.FullName, $false, $true)
            $text = $doc.Content.Text
            $doc.Close($false)
            Write-Host ('=== ' + $f.Name + ' (Length: ' + $text.Length + ') ===')
            $lines = $text -split "`n"
            foreach ($line in $lines) {
                if ($line -match 'agent' -and ($line -match 'ngày|giờ|tuần|time|hạn|liên hệ|phản hồi|cũ|mới|consent')) {
                    Write-Host ('  MATCH: ' + $line.Trim())
                }
            }
        } catch {
            Write-Host ('Error opening ' + $f.Name + ': ' + $_.Exception.Message)
        }
    }
}
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
