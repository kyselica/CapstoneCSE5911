/**
 * Controls Manager - Handles collapsible control panel
 * Auto-collapses on small screens to keep heart visible
 */

// Toggle controls expanded/collapsed state
function toggleControls() {
    const controls = document.getElementById('heartControls');
    if (controls) {
        controls.classList.toggle('collapsed');
        
        // Save preference to localStorage
        const isCollapsed = controls.classList.contains('collapsed');
        localStorage.setItem('heartControlsCollapsed', isCollapsed);
    }
}

// Check if screen is small and should default to collapsed
function shouldAutoCollapse() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Auto-collapse on:
    // - Mobile portrait (< 768px width)
    // - Small landscape (< 600px height)
    // - Small desktop (< 900px width and < 700px height)
    return width < 768 || height < 600 || (width < 900 && height < 700);
}

// Initialize controls state based on screen size
function initializeControlsState() {
    const controls = document.getElementById('heartControls');
    if (!controls) return;
    
    // Check if user has a saved preference
    const savedState = localStorage.getItem('heartControlsCollapsed');
    
    if (savedState !== null) {
        // Use saved preference
        if (savedState === 'true') {
            controls.classList.add('collapsed');
        } else {
            controls.classList.remove('collapsed');
        }
    } else {
        // No saved preference - auto-collapse on small screens
        if (shouldAutoCollapse()) {
            controls.classList.add('collapsed');
        }
    }
}

// Handle window resize
function handleResize() {
    const controls = document.getElementById('heartControls');
    if (!controls) return;
    
    // Only auto-collapse if user hasn't manually set a preference
    const savedState = localStorage.getItem('heartControlsCollapsed');
    if (savedState === null && shouldAutoCollapse()) {
        controls.classList.add('collapsed');
    }
}

// Debounce resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControlsState);
} else {
    initializeControlsState();
}

// Also initialize on orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(initializeControlsState, 100);
});

// Make toggle function available globally
window.toggleControls = toggleControls;

console.log('✅ Controls manager initialized');

