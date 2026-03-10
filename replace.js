import fs from 'fs';
const path = 'd:/Books/src/pages/Public.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const imports = `import SIPView from './investments/SIPView.jsx';
import MutualFundsView from './investments/MutualFundsView.jsx';
import CryptoView from './investments/CryptoView.jsx';
import BitcoinView from './investments/BitcoinView.jsx';
import OverallTradingView from './investments/OverallTradingView.jsx';`;

const appCssIndex = lines.findIndex(line => line.includes("import '../App.css';"));
lines.splice(appCssIndex + 1, 0, imports);

const startIdx = lines.findIndex(line => line.includes('// Trading SIP Page'));
const endIdx = lines.findIndex(line => line.includes('// Investors Page'));

const newComponents = `    // Trading Pages
    const TradingSIP = () => <SIPView />;
    const TradingMutualFunds = () => <MutualFundsView />;
    const TradingCrypto = () => <CryptoView />;
    const TradingBitcoin = () => <BitcoinView />;
    const TradingOverall = () => <OverallTradingView />;
`;

lines.splice(startIdx, endIdx - startIdx, newComponents);

fs.writeFileSync(path, lines.join('\n'));
console.log('Replaced lines successfully');
