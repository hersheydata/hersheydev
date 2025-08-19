<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FED 기준금리 대시보드</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }

        .header h1 {
            font-size: 2.8em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .api-status {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            background: rgba(46, 204, 113, 0.2);
            color: #2ecc71;
            border: 1px solid #2ecc71;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .btn {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
        }

        .btn-primary {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        }

        .btn-primary:hover {
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
            padding: 30px;
        }

        .chart-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .chart-container {
            position: relative;
            height: 500px;
            margin-bottom: 30px;
        }

        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .rate-highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 20px;
        }

        .rate-highlight .current-rate {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .rate-highlight .rate-date {
            opacity: 0.9;
            font-size: 0.9em;
        }

        .rate-highlight .rate-change {
            margin-top: 10px;
            font-size: 1.1em;
            font-weight: 600;
        }

        .stats-panel {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .stats-panel h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
            text-align: center;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .stat-item:last-child {
            border-bottom: none;
        }

        .stat-label {
            color: #6c757d;
            font-size: 0.95em;
        }

        .stat-value {
            font-weight: 600;
            font-size: 1.1em;
            color: #2c3e50;
        }

        .data-info {
            background: #e8f4f8;
            padding: 20px;
            border-radius: 15px;
            border-left: 4px solid #3498db;
        }

        .data-info h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .data-info p {
            color: #6c757d;
            font-size: 0.9em;
            line-height: 1.5;
            margin-bottom: 8px;
        }

        .chart-svg {
            width: 100%;
            height: 100%;
        }

        .chart-line {
            fill: none;
            stroke: #667eea;
            stroke-width: 3;
        }

        .chart-area {
            fill: rgba(102, 126, 234, 0.1);
        }

        .chart-dot {
            fill: #667eea;
            stroke: white;
            stroke-width: 2;
        }

        .chart-axis {
            stroke: #ddd;
            stroke-width: 1;
        }

        .chart-text {
            font-size: 12px;
            fill: #666;
            font-family: 'Segoe UI', sans-serif;
        }

        .chart-grid {
            stroke: #f0f0f0;
            stroke-width: 1;
        }

        .last-updated {
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }

        .data-table {
            margin-top: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .data-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #555;
            border-bottom: 2px solid #e9ecef;
        }

        .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #f0f0f0;
        }

        .data-table tr:hover {
            background: #f8f9fa;
        }

        .rate-up {
            color: #e74c3c;
        }

        .rate-down {
            color: #27ae60;
        }

        @media (max-width: 1024px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .sidebar {
                order: -1;
            }
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            
            .controls {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 200px;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="api-status">
                📊 실시간 데이터
            </div>
            <h1>🏛️ FED 기준금리 대시보드</h1>
            <p>미국 연방준비제도 기준금리 실시간 모니터링 시스템</p>
            <div class="controls">
                <button class="btn btn-primary" onclick="addRandomData()">
                    📈 새 데이터 시뮬레이션
                </button>
                <button class="btn" onclick="resetData()">
                    🔄 데이터 초기화
                </button>
                <button class="btn" onclick="exportData()">
                    📊 데이터 내보내기
                </button>
            </div>
        </div>

        <div class="main-content">
            <div class="chart-section">
                <h2>📈 FED 기준금리 추이 (지난 5년)</h2>
                <div class="chart-container">
                    <svg class="chart-svg" id="mainChart" viewBox="0 0 800 400">
                        <!-- 차트가 여기에 그려집니다 -->
                    </svg>
                </div>
                
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>기준금리</th>
                                <th>변화량</th>
                                <th>추세</th>
                            </tr>
                        </thead>
                        <tbody id="dataTableBody">
                        </tbody>
                    </table>
                </div>
                
                <div class="last-updated" id="lastUpdated">
                    마지막 업데이트: 2025년 8월
                </div>
            </div>

            <div class="sidebar">
                <div class="rate-highlight" id="currentRateDisplay">
                    <div class="current-rate">5.25%</div>
                    <div class="rate-date">2025년 8월</div>
                    <div class="rate-change">+0.25% (전월 대비)</div>
                </div>

                <div class="stats-panel">
                    <h3>📊 통계 정보</h3>
                    <div class="stat-item">
                        <span class="stat-label">평균 금리 (5년)</span>
                        <span class="stat-value" id="avgRate">2.85%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">최고 금리</span>
                        <span class="stat-value" id="maxRate">5.50%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">최저 금리</span>
                        <span class="stat-value" id="minRate">0.00%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">변동성 (표준편차)</span>
                        <span class="stat-value" id="volatility">2.18%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">데이터 포인트</span>
                        <span class="stat-value" id="dataCount">60개월</span>
                    </div>
                </div>

                <div class="data-info">
                    <h4>ℹ️ 시스템 정보</h4>
                    <p><strong>데이터 소스:</strong> 실시간 시뮬레이션</p>
                    <p><strong>업데이트:</strong> 실시간</p>
                    <p><strong>기간:</strong> 2020년 1월 ~ 현재</p>
                    <p><strong>단위:</strong> 퍼센트 (% 연율)</p>
                    <p><strong>특징:</strong> 완전 독립 실행</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 실제 FED 금리 패턴을 반영한 데이터
        let rateData = [
            {date: '2020-01', rate: 1.75, label: '코로나 이전'},
            {date: '2020-03', rate: 0.25, label: '코로나 대응 1차 인하'},
            {date: '2020-04', rate: 0.05, label: '제로 금리 정책'},
            {date: '2020-05', rate: 0.05, label: '제로 금리 유지'},
            {date: '2020-12', rate: 0.10, label: '완화 정책 지속'},
            {date: '2021-06', rate: 0.10, label: '회복 초기'},
            {date: '2021-12', rate: 0.08, label: '인플레이션 우려'},
            {date: '2022-03', rate: 0.33, label: '첫 금리 인상'},
            {date: '2022-05', rate: 0.83, label: '적극적 인상'},
            {date: '2022-07', rate: 1.68, label: '대폭 인상'},
            {date: '2022-09', rate: 2.56, label: '인상 지속'},
            {date: '2022-11', rate: 3.83, label: '고강도 인상'},
            {date: '2023-01', rate: 4.33, label: '인상 속도 조절'},
            {date: '2023-03', rate: 4.65, label: '은행 위기 우려'},
            {date: '2023-05', rate: 5.00, label: '인상 마무리'},
            {date: '2023-07', rate: 5.12, label: '피크 접근'},
            {date: '2023-09', rate: 5.33, label: '고금리 유지'},
            {date: '2023-11', rate: 5.33, label: '동결 정책'},
            {date: '2024-01', rate: 5.33, label: '안정화'},
            {date: '2024-03', rate: 5.33, label: '관망'},
            {date: '2024-05', rate: 5.25, label: '소폭 조정'},
            {date: '2024-07', rate: 5.25, label: '현 수준 유지'},
            {date: '2025-01', rate: 5.00, label: '완화 시작?'},
            {date: '2025-03', rate: 4.75, label: '점진적 완화'},
            {date: '2025-05', rate: 4.50, label: '완화 지속'},
            {date: '2025-08', rate: 5.25, label: '현재 수준'}
        ];

        // 차트 그리기
        function drawChart() {
            const svg = document.getElementById('mainChart');
            svg.innerHTML = '';

            const width = 800;
            const height = 400;
            const margin = {top: 40, right: 40, bottom: 60, left: 60};
            const chartWidth = width - margin.left - margin.right;
            const chartHeight = height - margin.top - margin.bottom;

            // 데이터 범위 계산
            const rates = rateData.map(d => d.rate);
            const minRate = Math.max(0, Math.min(...rates) - 0.5);
            const maxRate = Math.max(...rates) + 0.5;

            // 스케일 함수
            const xScale = (i) => margin.left + (i / (rateData.length - 1)) * chartWidth;
            const yScale = (rate) => margin.top + (1 - (rate - minRate) / (maxRate - minRate)) * chartHeight;

            // 그리드 라인
            for (let i = 0; i <= 5; i++) {
                const y = margin.top + (i / 5) * chartHeight;
                const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                gridLine.setAttribute('x1', margin.left);
                gridLine.setAttribute('y1', y);
                gridLine.setAttribute('x2', margin.left + chartWidth);
                gridLine.setAttribute('y2', y);
                gridLine.setAttribute('class', 'chart-grid');
                svg.appendChild(gridLine);

                // Y축 레이블
                const rate = maxRate - (i / 5) * (maxRate - minRate);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', margin.left - 10);
                text.setAttribute('y', y + 5);
                text.setAttribute('text-anchor', 'end');
                text.setAttribute('class', 'chart-text');
                text.textContent = rate.toFixed(1) + '%';
                svg.appendChild(text);
            }

            // 영역 채우기 (Area)
            let pathD = `M ${xScale(0)} ${yScale(rateData[0].rate)}`;
            for (let i = 1; i < rateData.length; i++) {
                pathD += ` L ${xScale(i)} ${yScale(rateData[i].rate)}`;
            }
            pathD += ` L ${xScale(rateData.length - 1)} ${margin.top + chartHeight}`;
            pathD += ` L ${xScale(0)} ${margin.top + chartHeight} Z`;

            const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            area.setAttribute('d', pathD);
            area.setAttribute('class', 'chart-area');
            svg.appendChild(area);

            // 라인 그리기
            let lineD = `M ${xScale(0)} ${yScale(rateData[0].rate)}`;
            for (let i = 1; i < rateData.length; i++) {
                lineD += ` L ${xScale(i)} ${yScale(rateData[i].rate)}`;
            }

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            line.setAttribute('d', lineD);
            line.setAttribute('class', 'chart-line');
            svg.appendChild(line);

            // 데이터 포인트
            rateData.forEach((d, i) => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', xScale(i));
                circle.setAttribute('cy', yScale(d.rate));
                circle.setAttribute('r', 4);
                circle.setAttribute('class', 'chart-dot');
                
                // 툴팁 효과
                circle.addEventListener('mouseenter', function() {
                    this.setAttribute('r', 6);
                    
                    // 툴팁 텍스트
                    const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    tooltip.setAttribute('id', 'tooltip');
                    tooltip.setAttribute('x', xScale(i));
                    tooltip.setAttribute('y', yScale(d.rate) - 15);
                    tooltip.setAttribute('text-anchor', 'middle');
                    tooltip.setAttribute('class', 'chart-text');
                    tooltip.style.fontWeight = 'bold';
                    tooltip.style.fill = '#2c3e50';
                    tooltip.textContent = `${d.date}: ${d.rate}%`;
                    svg.appendChild(tooltip);
                });
                
                circle.addEventListener('mouseleave', function() {
                    this.setAttribute('r', 4);
                    const tooltip = document.getElementById('tooltip');
                    if (tooltip) tooltip.remove();
                });
                
                svg.appendChild(circle);
            });

            // X축 레이블 (일부만 표시)
            const labelIndices = [0, 5, 10, 15, 20, rateData.length - 1];
            labelIndices.forEach(i => {
                if (i < rateData.length) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', xScale(i));
                    text.setAttribute('y', height - 20);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('class', 'chart-text');
                    text.textContent = rateData[i].date;
                    svg.appendChild(text);
                }
            });

            // 축 선
            const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xAxis.setAttribute('x1', margin.left);
            xAxis.setAttribute('y1', margin.top + chartHeight);
            xAxis.setAttribute('x2', margin.left + chartWidth);
            xAxis.setAttribute('y2', margin.top + chartHeight);
            xAxis.setAttribute('class', 'chart-axis');
            svg.appendChild(xAxis);

            const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            yAxis.setAttribute('x1', margin.left);
            yAxis.setAttribute('y1', margin.top);
            yAxis.setAttribute('x2', margin.left);
            yAxis.setAttribute('y2', margin.top + chartHeight);
            yAxis.setAttribute('class', 'chart-axis');
            svg.appendChild(yAxis);
        }

        // 통계 업데이트
        function updateStats() {
            const rates = rateData.map(d => d.rate);
            const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
            const max = Math.max(...rates);
            const min = Math.min(...rates);
            
            // 표준편차 계산
            const variance = rates.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / rates.length;
            const stdDev = Math.sqrt(variance);
            
            document.getElementById('avgRate').textContent = avg.toFixed(2) + '%';
            document.getElementById('maxRate').textContent = max.toFixed(2) + '%';
            document.getElementById('minRate').textContent = min.toFixed(2) + '%';
            document.getElementById('volatility').textContent = stdDev.toFixed(2) + '%';
            document.getElementById('dataCount').textContent = rateData.length + '개월';

            // 현재 금리 표시
            const latest = rateData[rateData.length - 1];
            const previous = rateData[rateData.length - 2];
            const change = latest.rate - previous.rate;
            
            document.getElementById('currentRateDisplay').innerHTML = `
                <div class="current-rate">${latest.rate.toFixed(2)}%</div>
                <div class="rate-date">${latest.date} (${latest.label})</div>
                <div class="rate-change ${change >= 0 ? 'rate-up' : 'rate-down'}">
                    ${change >= 0 ? '+' : ''}${change.toFixed(2)}% (전월 대비)
                </div>
            `;
        }

        // 데이터 테이블 업데이트
        function updateTable() {
            const tbody = document.getElementById('dataTableBody');
            tbody.innerHTML = '';
            
            // 최근 10개 데이터만 표시
            const recentData = rateData.slice(-10).reverse();
            
            recentData.forEach((item, index) => {
                const row = tbody.insertRow();
                const nextIndex = rateData.length - 1 - index;
                const prevRate = nextIndex > 0 ? rateData[nextIndex - 1].rate : item.rate;
                const change = item.rate - prevRate;
                
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td><strong>${item.rate.toFixed(2)}%</strong></td>
                    <td class="${change >= 0 ? 'rate-up' : 'rate-down'}">
                        ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
                    </td>
                    <td>${change > 0.1 ? '📈 인상' : change < -0.1 ? '📉 인하' : '➡️ 동결'}</td>
                `;
            });
        }

        // 랜덤 데이터 추가 (시뮬레이션)
        function addRandomData() {
            const lastData = rateData[rateData.length - 1];
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + 1);
            
            const dateStr = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
            
            // 현실적인 금리 변화 시뮬레이션
            const change = (Math.random() - 0.5) * 0.5; // -0.25% ~ +0.25%
            const newRate = Math.max(0, Math.min(6, lastData.rate + change));
            
            const scenarios = ['경제성장 둔화', '인플레이션 압력', '금융시장 안정', '고용지표 개선', '국제정세 변화'];
            const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            rateData.push({
                date: dateStr,
                rate: Math.round(newRate * 100) / 100,
                label: randomScenario
            });
            
            // 데이터가 너무 많아지면 오래된 것 제거
            if (rateData.length > 30) {
                rateData.shift();
            }
            
            updateDisplay();
        }

        // 데이터 초기화
        function resetData() {
            // 원본 데이터로 복원
            rateData = [
                {date: '2020-01', rate: 1.75, label: '코로나 이전'},
                {date: '2020-03', rate: 0.25, label: '코로나 대응 1차 인하'},
                {date: '2020-04', rate: 0.05, label: '제로 금리 정책'},
                {date: '2020-05', rate: 0.05, label: '제로 금리 유지'},
                {date: '2020-12', rate: 0.10, label: '완화 정책 지속'},
                {date: '2021-06', rate: 0.10, label: '회복 초기'},
                {date: '2021-12', rate: 0.08, label: '인플레이션 우려'},
                {date: '2022-03', rate: 0.33, label: '첫 금리 인상'},
                {date: '2022-05', rate: 0.83, label: '적극적 인상'},
                {date: '2022-07', rate: 1.68, label: '대폭 인상'},
                {date: '2022-09', rate: 2.56, label: '인상 지속'},
                {date: '2022-11', rate: 3.83, label: '고강도 인상'},
                {date: '2023-01', rate: 4.33, label: '인상 속도 조절'},
                {date: '2023-03', rate: 4.65, label: '은행 위기 우려'},
                {date: '2023-05', rate: 5.00, label: '인상 마무리'},
                {date: '2023-07', rate: 5.12, label: '피크 접근'},
                {date: '2023-09', rate: 5.33, label: '고금리 유지'},
                {date: '2023-11', rate: 5.33, label: '동결 정책'},
                {date: '2024-01', rate: 5.33, label: '안정화'},
                {date: '2024-03', rate: 5.33, label: '관망'},
                {date: '2024-05', rate: 5.25, label: '소폭 조정'},
                {date: '2024-07', rate: 5.25, label: '현 수준 유지'},
                {date: '2025-01', rate: 5.00, label: '완화 시작?'},
                {date: '2025-03', rate: 4.75, label: '점진적 완화'},
                {date: '2025-05', rate: 4.50, label: '완화 지속'},
                {date: '2025-08', rate: 5.25, label: '현재 수준'}
            ];
            
            updateDisplay();
        }

        // 데이터 내보내기
        function exportData() {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "날짜,기준금리(%),상황설명\n"
                + rateData.map(d => `${d.date},${d.rate},"${d.label}"`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "fed_interest_rates.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // 전체 화면 업데이트
        function updateDisplay() {
            drawChart();
            updateStats();
            updateTable();
            document.getElementById('lastUpdated').textContent = 
                '마지막 업데이트: ' + new Date().toLocaleString('ko-KR');
        }

        // 자동 업데이트 시뮬레이션 (30초마다)
        function startAutoUpdate() {
            setInterval(() => {
                // 20% 확률로 새 데이터 추가
                if (Math.random() < 0.2) {
                    addRandomData();
                }
            }, 30000);
        }

        // 페이지 로드 시 초기화
        document.addEventListener('DOMContentLoaded', function() {
            updateDisplay();
            // startAutoUpdate(); // 원하면 주석 해제
            
            // 키보드 단축키
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'n':
                            e.preventDefault();
                            addRandomData();
                            break;
                        case 'r':
                            e.preventDefault();
                            resetData();
                            break;
                        case 's':
                            e.preventDefault();
                            exportData();
                            break;
                    }
                }
            });
            
            console.log('🎉 FED 기준금리 대시보드가 성공적으로 로드되었습니다!');
            console.log('💡 단축키: Ctrl+N(새 데이터), Ctrl+R(초기화), Ctrl+S(내보내기)');
        });
    </script>
</body>
</html>
