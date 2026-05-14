document.addEventListener('DOMContentLoaded', () => {
    // === File Upload Drag & Drop ===
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const submitBtn = document.getElementById('submit-btn');

    if (dropZone && fileInput) {
        ['dragenter', 'dragover'].forEach(ev => {
            dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); }, false);
        });
        ['dragleave', 'drop'].forEach(ev => {
            dropZone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover'); }, false);
        });
        dropZone.addEventListener('drop', e => { fileInput.files = e.dataTransfer.files; handleFiles(); }, false);
        fileInput.addEventListener('change', handleFiles, false);

        function handleFiles() {
            if (fileInput.files.length > 0) {
                const f = fileInput.files[0];
                const mb = (f.size / (1024 * 1024)).toFixed(2);
                fileNameDisplay.textContent = `Selected: ${f.name} (${mb} MB)`;
                submitBtn.style.display = 'flex';
            } else {
                fileNameDisplay.textContent = '';
                submitBtn.style.display = 'none';
            }
        }
    }

    // === History Log Modal ===
    const viewButtons = document.querySelectorAll('.view-log-btn');
    const modal = document.getElementById('log-modal');
    const closeModal = document.getElementById('close-modal');
    const modalConsole = document.getElementById('modal-console');
    let pollInterval;

    if (viewButtons.length > 0 && modal) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                modal.classList.add('show');
                modalConsole.textContent = 'Loading...';
                fetchLog(id);
                pollInterval = setInterval(() => fetchLog(id), 2000);
            });
        });
        closeModal.addEventListener('click', () => { modal.classList.remove('show'); clearInterval(pollInterval); });
        modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('show'); clearInterval(pollInterval); } });

        function fetchLog(id) {
            fetch(`/history/${id}`).then(r => r.json()).then(data => {
                modalConsole.textContent = data.log_output || 'No output yet...';
                modalConsole.scrollTop = modalConsole.scrollHeight;
                const badge = document.getElementById(`status-${id}`);
                if (badge) { badge.textContent = data.status; badge.className = `badge status-${data.status}`; }
                if (data.status === 'completed' || data.status === 'failed') clearInterval(pollInterval);
            }).catch(err => console.error('Error:', err));
        }
    }

    // === Auto-dismiss flash messages ===
    document.querySelectorAll('.alert').forEach(el => {
        setTimeout(() => { el.style.transition = 'opacity .5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 5000);
    });
});
