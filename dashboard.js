document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const mockLoginBtn = document.getElementById('mock-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginError = document.getElementById('login-error');

    // Simulate Google Login Process
    mockLoginBtn.addEventListener('click', () => {
        // Here we would normally call the Google Identity Services popup
        // For demonstration, we simulate a successful login check

        // Let's pretend the user selected an email
        const userEmail = "membro@sincjr.com.br"; // Change this to test the error state

        if (userEmail.endsWith('@sincjr.com.br')) {
            // Success
            loginError.style.display = 'none';

            // Fade out login
            loginOverlay.classList.add('hidden');

            // Show dashboard after fade out
            setTimeout(() => {
                loginOverlay.style.display = 'none';
                dashboardContent.style.display = 'block';

                // Trigger animations for widgets
                const widgets = document.querySelectorAll('.slide-up');
                widgets.forEach(widget => {
                    widget.classList.add('visible');
                });
            }, 500); // matches the CSS transition time

        } else {
            // Error
            loginError.style.display = 'block';
            loginError.textContent = "Acesso negado. Utilize seu e-mail @sincjr.com.br";
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        // Hide dashboard
        dashboardContent.style.display = 'none';

        // Show login
        loginOverlay.style.display = 'flex';
        // Small delay to allow display block to apply before changing opacity
        setTimeout(() => {
            loginOverlay.classList.remove('hidden');
        }, 10);

        // Reset animations
        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.remove('visible');
        });
    });
});
