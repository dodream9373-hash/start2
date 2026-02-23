let currentConfig = {};

function selectCountry(code, name, maxNum, mainCount, bonusMax) {
    currentConfig = { code, name, maxNum, mainCount, bonusMax };
    const result = document.getElementById('result');
    const nameEl = document.getElementById('lotto-name');
    const rangeEl = document.getElementById('lotto-range');
    
    nameEl.textContent = name;
    rangeEl.textContent = `${mainCount} from 1-${maxNum} ${bonusMax > 0 ? `+ Bonus 1-${bonusMax}` : ''}`;
    result.style.display = 'block';
    document.getElementById('sets').innerHTML = '';
}

function generateNumbers(config) {
    const { maxNum, mainCount, bonusMax } = config;
    const numbers = [];
    
    const totalNumbers = mainCount + (bonusMax > 0 ? 1 : 0);
    while (numbers.length < totalNumbers) {
        const num = Math.floor(Math.random() * maxNum) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    numbers.sort((a, b) => a - b);
    
    return numbers;
}

function generateLotto() {
    const setsDiv = document.getElementById('sets');
    let html = '';
    
    for (let i = 1; i <= 5; i++) {
        const numbers = generateNumbers(currentConfig);
        const mainNumbers = numbers.slice(0, currentConfig.mainCount);
        const bonus = currentConfig.bonusMax > 0 ? numbers[numbers.length - 1] : null;
        
        html += `<div class=\"set\">
            <div class=\"set-title\">SET ${i}</div>
            <div class=\"numbers\">`;
        mainNumbers.forEach(num => {
            html += `<span class=\"number\">${num}</span>`;
        });
        if (bonus !== null) {
            html += `<span class=\"number bonus\">+${bonus}</span>`;
        }
        html += `</div></div>`;
    }
    
    setsDiv.innerHTML = html;
}

class WaitingList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .waiting-list-container {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 30px;
                    background: rgba(0, 255, 65, 0.1);
                    border: 1px solid rgba(0, 255, 65, 0.3);
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
                    text-align: center;
                    font-family: 'Orbitron', monospace;
                }
                h2 {
                    margin-bottom: 20px;
                    font-size: 1.8em;
                    font-weight: 700;
                    color: #00ff41;
                    text-shadow: 0 0 10px #00ff41;
                }
                p {
                    margin-bottom: 25px;
                    color: #eee;
                }
                .waiting-list-form {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .waiting-list-input {
                    flex-grow: 1;
                    padding: 12px;
                    border: 2px solid #00ff41;
                    background: rgba(0, 0, 0, 0.7);
                    color: #00ff41;
                    border-radius: 8px;
                    font-family: 'Orbitron', monospace;
                    font-size: 1em;
                }
                .waiting-list-input::placeholder {
                    color: rgba(0, 255, 65, 0.5);
                }
                .waiting-list-button {
                    padding: 12px 25px;
                    border: 2px solid #00ff41;
                    background: #00ff41;
                    color: #000;
                    border-radius: 8px;
                    font-family: 'Orbitron', monospace;
                    font-weight: 700;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .waiting-list-button:hover {
                    background: #000;
                    color: #00ff41;
                    box-shadow: 0 0 15px #00ff41;
                }
                #confirmation {
                    margin-top: 20px;
                    font-size: 1.1em;
                    color: #00ff41;
                    font-weight: 700;
                }
            </style>
            <div class=\"waiting-list-container\">
                <h2>High Demand Alert!</h2>
                <p>Due to overwhelming demand, we've temporarily paused new number generation. Join our waiting list to be notified when the service is back online.</p>
                <form class=\"waiting-list-form\">
                    <input type=\"email\" class=\"waiting-list-input\" placeholder=\"Enter your email\" required>
                    <button type=\"submit\" class=\"waiting-list-button\">Join Waitlist</button>
                </form>
                <div id=\"confirmation\"></div>
            </div>
        `;
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector('.waiting-list-form');
        const confirmation = this.shadowRoot.querySelector('#confirmation');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = this.shadowRoot.querySelector('.waiting-list-input');
            const email = emailInput.value;
            if (email) {
                form.style.display = 'none';
                confirmation.textContent = `✅ Thank you! You've been added to the waiting list. We'll notify ${email}.`;
            }
        });
    }
}

customElements.define('waiting-list', WaitingList);