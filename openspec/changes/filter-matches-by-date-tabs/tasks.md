## 1. UI Tab Header

- [x] 1.1 In `src/components/MatchGrid.tsx`, import `useState` and define `const [activeTab, setActiveTab] = useState<'today' | 'future'>('today')`.
- [x] 1.2 Inject a tab selection UI above the Matches List: a flex container with two buttons ("Jogos de Hoje" and "Jogos Futuros").
- [x] 1.3 Apply active/inactive Tailwind styles to the buttons based on `activeTab`.

## 2. Array Filtering

- [x] 2.1 Before mapping over `matches`, create `const filteredMatches = matches.filter(match => { const iso = match.date.toISOString(); return activeTab === 'today' ? iso.startsWith('2026-06-22') : iso > '2026-06-22T23:59:59Z'; });`
- [x] 2.2 Update the rendering loop to map over `filteredMatches` instead of `matches`.
- [x] 2.3 Update the `EmptyState` logic to check `filteredMatches.length === 0`.
- [x] 2.4 Ensure the "Salvar Meus Palpites" floating button logic checks `filteredMatches` instead of `matches` so it only renders if there are pending matches in the *current view*.
