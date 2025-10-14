/**
 * UI Enhancements for Heart Visualization
 * Improves user interaction and provides better visual feedback
 */

// Enhanced toggle animation function
window.toggleAnimationEnhanced = function() {
    const button = document.getElementById('animationToggle');
    const textSpan = document.getElementById('animationText');
    const icon = button.querySelector('.icon');
    
    if (!button || !textSpan || !icon) return;
    
    const currentState = button.getAttribute('data-state');
    
    if (currentState === 'playing') {
        button.setAttribute('data-state', 'paused');
        textSpan.textContent = 'Play';
        icon.textContent = '▶️';
    } else {
        button.setAttribute('data-state', 'playing');
        textSpan.textContent = 'Pause';
        icon.textContent = '⏸️';
    }
    
    // Call the original toggle function if it exists
    if (window.toggleAnimation) {
        window.toggleAnimation();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add focus visible for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Smooth value updates for sliders
    const bpmSlider = document.getElementById('bpmSlider');
    const volumeSlider = document.getElementById('volumeSlider');
    
    if (bpmSlider) {
        bpmSlider.addEventListener('input', function() {
            this.style.setProperty('--slider-progress', `${(this.value - this.min) / (this.max - this.min) * 100}%`);
        });
        // Initialize
        bpmSlider.dispatchEvent(new Event('input'));
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            this.style.setProperty('--slider-progress', `${(this.value - this.min) / (this.max - this.min) * 100}%`);
        });
        // Initialize
        volumeSlider.dispatchEvent(new Event('input'));
    }
    
    // Add loading animation completion
    const loading = document.getElementById('loading');
    if (loading) {
        // Watch for when loading is hidden
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const display = window.getComputedStyle(loading).display;
                    if (display === 'none') {
                        document.body.classList.add('loaded');
                    }
                }
            });
        });
        
        observer.observe(loading, { attributes: true });
    }
    
    // Responsive controls collapse on mobile landscape
    function handleOrientationChange() {
        const controls = document.querySelector('.controls');
        if (!controls) return;
        
        if (window.innerHeight < 600 && window.innerWidth > window.innerHeight) {
            controls.classList.add('landscape-mode');
        } else {
            controls.classList.remove('landscape-mode');
        }
    }
    
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    handleOrientationChange();
    
    // Add tooltips or help text on hover (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        const rhythmSelect = document.getElementById('rhythmSelect');
        if (rhythmSelect) {
            const options = {
                'Normal S1 S2': 'Healthy heart rhythm with normal S1 and S2 sounds',
                'S3 Gallop': 'Additional third heart sound, may indicate heart failure',
                'S4 Gallop': 'Additional fourth heart sound, may indicate stiff ventricle',
                'Mid-Systolic Click': 'Click sound during contraction, often mitral valve',
                'Split S1': 'Split first heart sound, may be normal or indicate bundle branch block'
            };
            
            rhythmSelect.addEventListener('mouseenter', function() {
                const selectedOption = this.options[this.selectedIndex].value;
                const description = options[selectedOption];
                if (description) {
                    this.title = description;
                }
            });
        }
    }
    
    console.log('🎨 UI Enhancements loaded successfully!');
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .keyboard-nav :focus {
        outline: 3px solid var(--color-primary);
        outline-offset: 2px;
    }
    
    body:not(.keyboard-nav) :focus {
        outline: none;
    }
    
    .control-btn {
        position: relative;
        overflow: hidden;
    }
    
    .loaded .controls {
        animation: slideInUp 0.5s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .controls.landscape-mode {
        flex-direction: row;
        flex-wrap: wrap;
        max-height: calc(100vh - 16px);
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

