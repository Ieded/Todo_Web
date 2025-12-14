let allData = [];
let currentCategory = 'all'; // 현재 선택된 카테고리 저장

// 1. 데이터 가져오기
fetch('../php/list.php')
    .then(res => res.json())
    .then(data => {
        allData = data;
        renderFilteredData(); // 처음엔 전체 데이터 그리기
    });

// 2. 검색어 입력 시 실행
document.getElementById('searchInput').addEventListener('keyup', function() {
    renderFilteredData();
});

// 3. [NEW] 카테고리 버튼 클릭 시 실행
function setCategory(category, btn) {
    currentCategory = category;

    // 버튼 색상 변경 (모두 끄고 클릭한 것만 켜기)
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderFilteredData(); // 화면 다시 그리기
}

// 4. [NEW] 데이터 필터링 (검색어 + 카테고리 동시 적용)
function renderFilteredData() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = allData.filter(item => {
        // 1) 검색어 포함 여부
        const matchKeyword = item.task.toLowerCase().includes(keyword);
        
        // 2) 카테고리 일치 여부 ('all'이면 무조건 통과)
        const matchCategory = (currentCategory === 'all') || (item.category === currentCategory);

        return matchKeyword && matchCategory;
    });

    drawList(filtered);
}

// 5. 화면 그리기 함수
function drawList(data) {
    const container = document.getElementById('todo-list');
    container.innerHTML = ''; 

    if (data.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px; color:#aaa;">
                <i class="bi bi-inbox" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                <p>할 일이 없습니다.</p>
            </div>`;
        return;
    }

    data.forEach(item => {
        const dateStr = item.due_date ? item.due_date.toString().split('T')[0] : '';
        
        // D-Day 계산
        let dDayHtml = '';
        if(dateStr && item.is_done == 0) {
            const diff = (new Date(dateStr) - new Date().setHours(0,0,0,0)) / (1000*60*60*24);
            if(diff < 0) dDayHtml = '<span class="tag" style="color:#e03131; background:#fff5f5;">만료</span>';
            else if(diff === 0) dDayHtml = '<span class="tag" style="color:#e03131; background:#fff5f5;">D-Day</span>';
            else dDayHtml = `<span class="tag" style="color:#099268; background:#e6fcf5;">D-${Math.ceil(diff)}</span>`;
        }

        // 카테고리 뱃지 색상
        let catColor = '#eee';
        let catText = item.category || '기타';
        if(catText === '공부') catColor = '#e7f5ff'; 
        if(catText === '운동') catColor = '#fff5f5'; 
        if(catText === '약속') catColor = '#f3f0ff'; 
        if(catText === '쇼핑') catColor = '#fff9db'; 

        const doneClass = item.is_done == 1 ? 'done' : '';
        const checked = item.is_done == 1 ? 'checked' : '';

        const html = `
            <div class="todo-item ${doneClass}">
                <div class="item-left">
                    <input type="checkbox" class="check-box" onclick="toggleDone(${item.id})" ${checked}>
                    <div>
                        <div class="item-title">
                            <span class="tag" style="background:${catColor}; font-weight:600; margin-right:5px;">
                                ${catText}
                            </span>
                            ${item.task}
                        </div>
                        <div class="item-tags">
                            <span class="tag">
                                <i class="bi bi-calendar"></i> ${dateStr || '기한 없음'}
                            </span>
                            ${dDayHtml}
                        </div>
                    </div>
                </div>

                <div style="display:flex; gap:5px;">
                    <button class="icon-btn" onclick="openModal(this)" 
                        data-id="${item.id}" data-task="${item.task}" 
                        data-date="${dateStr}" data-category="${catText}">
                        <i class="bi bi-pencil-square" style="font-size:1.2rem;"></i>
                    </button>
                    <button class="icon-btn delete" onclick="deleteItem(${item.id})">
                        <i class="bi bi-trash3" style="font-size:1.2rem;"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// --- 기능 함수들 (수정, 삭제, 완료) ---

function openModal(btn) {
    document.getElementById('modal-id').value = btn.dataset.id;
    document.getElementById('modal-task').value = btn.dataset.task;
    document.getElementById('modal-date').value = btn.dataset.date;
    if(document.getElementById('modal-category')) {
        document.getElementById('modal-category').value = btn.dataset.category;
    }
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

function updateItem() {
    const data = {
        id: document.getElementById('modal-id').value,
        task: document.getElementById('modal-task').value,
        dueDate: document.getElementById('modal-date').value,
        category: document.getElementById('modal-category').value
    };
    fetch('../php/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => { if(res.ok) window.location.reload(); });
}

function deleteItem(id) {
    if(confirm('삭제하시겠습니까?')) {
        fetch(`../php/delete.php?id=${id}`, { method: 'DELETE' })
            .then(res => { if(res.ok) window.location.reload(); });
    }
}

function toggleDone(id) {
    fetch('../php/toggle.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    }).then(res => { if(res.ok) window.location.reload(); });
}