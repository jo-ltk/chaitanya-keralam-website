Get-ChildItem 'C:\Users\joelt\Downloads\New folder\home\*.png' | ForEach-Object {
    try {
        $img = [System.Drawing.Image]::FromFile($_.FullName)
        $r = '{0} {1}x{2}' -f $_.Name, $img.Width, $img.Height
        $img.Dispose()
        $r
    } catch {
        $_.Name + ' ERROR'
    }
}
