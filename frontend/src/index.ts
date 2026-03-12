// entry point for the app
console.log('Paulie\'s Studios frontend loaded');

// basic state for studio selection
const studios = ['design', 'trade', 'flight', 'convert'];
let currentStudio = 'design';

function renderStudio() {
  const main = document.getElementById('main-region');
  if (main) {
    main.textContent = `MAIN REGION - ${currentStudio.toUpperCase()}`;
  }
}

renderStudio();

// simple navigation via console for now
(window as any).setStudio = (name: string) => {
  if (studios.includes(name)) {
    currentStudio = name;
    renderStudio();
  }
};
