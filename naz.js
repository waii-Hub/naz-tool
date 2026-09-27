(function() {
    // Thông báo kiểm tra xem script có được gọi thành công không
    alert("Script NAZ UI đã được kích hoạt thành công!");

    // Tránh lỗi khi trang web chưa load xong thẻ body
    if (!document.body) {
        alert("Lỗi: Trang web này chưa tải xong hoặc không cho phép hiển thị UI!");
        return;
    }

    // Xóa UI cũ nếu đã tồn tại
    if (document.getElementById('naz-ui-box')) {
        document.getElementById('naz-ui-box').remove();
    }

    // Tạo khung giao diện
    const container = document.createElement('div');
    container.id = 'naz-ui-box';
    container.innerHTML = `
        <div style="position: fixed; top: 50px; right: 20px; background: #000000; border: 2px solid #ffffff; border-radius: 6px; padding: 10px; width: 180px; box-shadow: 0px 4px 15px rgba(255,255,255,0.2); z-index: 999999; font-family: monospace; color: #ffffff; text-align: center;">
            <div style="font-size: 12px; font-weight: bold; color: #ffffff; margin-bottom: 8px; border-bottom: 1px solid #444; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                <span>NAZ UI [B/W]</span>
                <span style="cursor:pointer; font-size: 14px;" onclick="document.getElementById('naz-ui-box').remove()">×</span>
            </div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                <button id="btn-ads" style="background: #ffffff; color: black; border: 1px solid #ffffff; padding: 5px; font-size: 10px; border-radius: 3px; cursor: pointer; flex: 1; font-weight: bold;" onclick="setMode('ads')">Auto QC</button>
                <button id="btn-puzzle" style="background: #111; color: white; border: 1px solid #555; padding: 5px; font-size: 10px; border-radius: 3px; cursor: pointer; flex: 1;" onclick="setMode('puzzle')">Auto Sắp Xếp</button>
            </div>
            <button id="toggle-btn" style="background: #ffffff; color: black; font-weight: bold; width: 100%; padding: 7px; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;" onclick="toggleTool()">TURN ON</button>
            <div id="status" style="font-size: 9px; margin-top: 6px; color: #aaaaaa;">Trạng thái: Đang tắt</div>
        </div>
    `;
    document.body.appendChild(container);

    window.currentMode = 'ads';
    window.isOn = false;
    window.toolInterval = null;

    window.setMode = function(mode) {
        window.currentMode = mode;
        if(mode === 'ads') {
            document.getElementById('btn-ads').style.background = '#ffffff';
            document.getElementById('btn-ads').style.color = 'black';
            document.getElementById('btn-ads').style.fontWeight = 'bold';
            document.getElementById('btn-puzzle').style.background = '#111';
            document.getElementById('btn-puzzle').style.color = 'white';
            document.getElementById('btn-puzzle').style.fontWeight = 'normal';
        } else {
            document.getElementById('btn-puzzle').style.background = '#ffffff';
            document.getElementById('btn-puzzle').style.color = 'black';
            document.getElementById('btn-puzzle').style.fontWeight = 'bold';
            document.getElementById('btn-ads').style.background = '#111';
            document.getElementById('btn-ads').style.color = 'white';
            document.getElementById('btn-ads').style.fontWeight = 'normal';
        }
    };

    window.toggleTool = function() {
        window.isOn = !window.isOn;
        let btn = document.getElementById('toggle-btn');
        let status = document.getElementById('status');
        
        if (window.isOn) {
            btn.innerText = "TURN OFF";
            btn.style.background = "#333333";
            btn.style.color = "#ffffff";
            status.innerText = "Đang quét màn hình...";
            
            window.toolInterval = setInterval(() => {
                kiemTraVaXuLyThongMinh();
            }, 2000);

        } else {
            btn.innerText = "TURN ON";
            btn.style.background = "#ffffff";
            btn.style.color = "black";
            status.innerText = "Trạng thái: Đang tắt";
            if(window.toolInterval) clearInterval(window.toolInterval);
        }
    };

    function kiemTraVaXuLyThongMinh() {
        let status = document.getElementById('status');
        let theVideo = document.querySelector('video');
        let noiDungTrang = document.body.innerText.toLowerCase();
        
        let laManHinhVideo = theVideo || noiDungTrang.includes("quảng cáo") || noiDungTrang.includes("ad") || noiDungTrang.includes("video");
        let laManHinhSapXep = noiDungTrang.includes("puzzle") || noiDungTrang.includes("sắp xếp") || noiDungTrang.includes("ghép hình") || document.querySelector('canvas');

        if (window.currentMode === 'ads') {
            status.innerText = "[Auto QC] Đang kiểm tra...";
            if (laManHinhVideo) {
                status.innerText = "[Auto QC] Phát hiện Video! Đang chờ...";
                let nutBoQua = document.querySelector('.close-btn, .skip-ad, [aria-label*="Close"], button.close');
                if (nutBoQua) {
                    nutBoQua.click();
                    status.innerText = "[Auto QC] Đã bấm tắt QC!";
                } else if (theVideo && theVideo.ended) {
                    status.innerText = "[Auto QC] Video xong!";
                }
            } else {
                status.innerText = "[Auto QC] Tìm video QC...";
            }
        } 
        else if (window.currentMode === 'puzzle') {
            status.innerText = "[Auto Sắp Xếp] Đang quét...";
            if (laManHinhSapXep) {
                status.innerText = "[Auto Sắp Xếp] Đang phân tích ảnh gốc...";
            } else {
                status.innerText = "[Auto Sắp Xếp] Tìm màn sắp xếp...";
            }
        }
    }
})();
