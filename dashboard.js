function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    const loginError = document.getElementById('login-error');
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Verificando se o email pertence ao domínio @sincjr.com.br
    // O Google Workspace geralmente inclui a claim 'hd' (Hosted Domain)
    if (responsePayload.hd === 'sincjr.com.br' || responsePayload.email.endsWith('@sincjr.com.br')) {
        loginError.style.display = 'none';
        
        // Salva na sessão para manter o login ao recarregar a página
        sessionStorage.setItem('sincUser', JSON.stringify({
            name: responsePayload.name,
            email: responsePayload.email
        }));
        
        showDashboard(responsePayload.name);
    } else {
        // Acesso Negado
        loginError.style.display = 'block';
        loginError.textContent = "Acesso negado. Utilize seu e-mail @sincjr.com.br";
        
        // Desconecta o usuário do app caso ele tenha logado com conta pessoal
        google.accounts.id.revoke(responsePayload.email, done => {
            console.log('Acesso revogado para conta não autorizada');
        });
    }
}

function showDashboard(userName) {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const userNameSpan = document.getElementById('user-name');
    
    userNameSpan.textContent = userName;
    
    loginOverlay.classList.add('hidden');
    setTimeout(() => {
        loginOverlay.style.display = 'none';
        dashboardContent.style.display = 'block';

        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.add('visible');
        });
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const logoutBtn = document.getElementById('logout-btn');

    // Verifica se já existe um usuário na sessão (Logado)
    const storedUser = sessionStorage.getItem('sincUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        showDashboard(user.name);
    } else {
        // Inicializa o Google Sign-In
        google.accounts.id.initialize({
            client_id: "269603322713-gp2fcbgpbi0ls37gj07lia99odn3l457.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        
        google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", text: "continue_with" } 
        );
    }

    // Botão de Sair (Logout)
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('sincUser');
        google.accounts.id.disableAutoSelect();

        dashboardContent.style.display = 'none';
        loginOverlay.style.display = 'flex';
        
        setTimeout(() => {
            loginOverlay.classList.remove('hidden');
        }, 10);

        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.remove('visible');
        });
        
        // Re-renderiza o botão do Google caso ele tenha sumido
        if (typeof google !== 'undefined' && document.getElementById("google-login-btn").innerHTML === "") {
             google.accounts.id.renderButton(
                document.getElementById("google-login-btn"),
                { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", text: "continue_with" }
            );
        }
    });
});
