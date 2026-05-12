function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
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

        // Salva no localStorage para manter o login permanentemente (até que saia)
        localStorage.setItem('sincUser', JSON.stringify({
            name: responsePayload.name,
            email: responsePayload.email
        }));

        showDashboard(responsePayload.name, responsePayload.email);
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

function showDashboard(userName, userEmail = '', instant = false) {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const userNameSpan = document.getElementById('user-name');

    if (userEmail) {
        userNameSpan.innerHTML = `${userName}<br><span style="font-size: 0.8rem; color: var(--color-primary); font-weight: 400;">${userEmail}</span>`;
    } else {
        userNameSpan.textContent = userName;
    }

    if (instant) {
        loginOverlay.style.display = 'none';
        dashboardContent.style.display = 'block';
        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.add('visible');
            // Remove transition delay for instant load
            widget.style.transitionDelay = '0s';
        });
    } else {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const logoutBtn = document.getElementById('logout-btn');



    // Previne que a página do dashboard role (scroll) enquanto o usuário navega na planilha
    const sheetWidgetBody = document.getElementById('sheet-widget-body');
    if (sheetWidgetBody) {
        sheetWidgetBody.addEventListener('mouseenter', () => {
            // Adiciona padding para evitar que o layout pule quando o scroll sumir
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
        });
        sheetWidgetBody.addEventListener('mouseleave', () => {
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        });
    }

    // Inicializa o Google Sign-In independentemente de estar logado na sessão ou não
    // Isso evita o erro "Missing required parameter: client_id" ao deslogar e tentar relogar
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "269603322713-gp2fcbgpbi0ls37gj07lia99odn3l457.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
    }

    // Verifica se já existe um usuário na sessão (Logado)
    const storedUser = localStorage.getItem('sincUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        showDashboard(user.name, user.email, true); // Use instant=true here
    } else {
        if (typeof google !== 'undefined') {
            google.accounts.id.renderButton(
                document.getElementById("google-login-btn"),
                { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", text: "continue_with" }
            );
        }
    }

    // Botão de Sair (Logout)
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('sincUser');
        localStorage.removeItem('sincDriveToken');
        google.accounts.id.disableAutoSelect();

        const authDriveBtn = document.getElementById('auth-drive-btn');
        if (authDriveBtn) authDriveBtn.style.display = 'inline-block';

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

    // --- Nova Lógica do Google Drive API (Navegação Interna) ---
    let currentAccessToken = null;
    let folderHistory = [];
    const rootFolderId = '0B_pfgOzEMjWhWUh6ZFVLMnFlTDg';
    let currentFolderId = rootFolderId;

    const authDriveBtn = document.getElementById('auth-drive-btn');
    const backBtn = document.getElementById('drive-back-btn');

    if (authDriveBtn) {
        // Inicializa o Token Client
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: "269603322713-gp2fcbgpbi0ls37gj07lia99odn3l457.apps.googleusercontent.com",
            scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    currentAccessToken = tokenResponse.access_token;

                    // Salva o token no localStorage com tempo de expiração
                    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
                    localStorage.setItem('sincDriveToken', JSON.stringify({
                        token: currentAccessToken,
                        expiresAt: expiresAt
                    }));

                    authDriveBtn.style.display = 'none'; // Esconde o botão após sincronizar
                    folderHistory = []; // Reseta o histórico
                    currentFolderId = rootFolderId;
                    fetchDriveFiles(currentAccessToken, rootFolderId);
                }
            },
        });

        // Verifica se já temos um token válido salvo
        const storedTokenStr = localStorage.getItem('sincDriveToken');
        if (storedTokenStr) {
            const storedToken = JSON.parse(storedTokenStr);
            // Verifica se o token ainda é válido (ainda não expirou)
            if (storedToken.expiresAt > Date.now() + 60000) { // 1 minuto de margem
                currentAccessToken = storedToken.token;
                authDriveBtn.style.display = 'none'; // Já está sincronizado
                fetchDriveFiles(currentAccessToken, rootFolderId);
            }
        }

        authDriveBtn.addEventListener('click', () => {
            const storedUser = localStorage.getItem('sincUser');
            let hint = '';
            if (storedUser) {
                const user = JSON.parse(storedUser);
                hint = user.email;
            }
            tokenClient.requestAccessToken({ hint: hint });
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (folderHistory.length > 0) {
                const prevFolderId = folderHistory.pop();
                fetchDriveFiles(currentAccessToken, prevFolderId, true);
            }
        });
    }

    // Modal de Preview
    const previewModal = document.getElementById('file-preview-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            previewModal.style.display = 'none';
            document.getElementById('file-preview-iframe').src = ''; // Para o carregamento
        });
    }

    // Fecha o modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
            document.getElementById('file-preview-iframe').src = '';
        }
    });



    // Função de busca e renderização (disponível globalmente para ser chamada recursivamente)
    function fetchDriveFiles(accessToken, targetFolderId, isBack = false) {
        const container = document.getElementById('drive-files-container');
        const backBtn = document.getElementById('drive-back-btn');
        container.innerHTML = '<p class="text-center text-muted">Carregando arquivos...</p>';

        // Atualiza histórico se estiver navegando para frente
        if (!isBack && currentFolderId !== targetFolderId && currentAccessToken) {
            folderHistory.push(currentFolderId);
        }
        currentFolderId = targetFolderId;

        // Mostra/Esconde botão de voltar
        if (backBtn) {
            backBtn.style.display = folderHistory.length > 0 ? 'inline-block' : 'none';
        }

        fetch(`https://www.googleapis.com/drive/v3/files?q='${targetFolderId}'+in+parents&fields=files(id,name,mimeType,webViewLink)&orderBy=folder,name`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    container.innerHTML = `<p class="text-center" style="color: #ff5f56;">Erro: ${data.error.message}</p>`;
                    return;
                }

                const files = data.files;
                if (!files || files.length === 0) {
                    container.innerHTML = '<p class="text-center text-muted">A pasta está vazia.</p>';
                    return;
                }

                container.innerHTML = '';
                files.forEach(file => {
                    const item = document.createElement('a');
                    item.href = '#';
                    item.className = 'drive-file-item slide-up visible';

                    const isFolder = file.mimeType.includes('folder');
                    let strokeColor = isFolder ? 'var(--color-primary)' : 'currentColor';

                    // Ícone genérico de documento
                    let svgPath = `
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                `;

                    // Muda para ícone de pasta se for pasta
                    if (isFolder) {
                        svgPath = `
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    `;
                    }

                    item.innerHTML = `
                    <div class="file-icon" style="color: ${strokeColor}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            ${svgPath}
                        </svg>
                    </div>
                    <div class="file-name" title="${file.name}">${file.name}</div>
                `;

                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (isFolder) {
                            fetchDriveFiles(accessToken, file.id);
                        } else {
                            const previewModal = document.getElementById('file-preview-modal');
                            const iframe = document.getElementById('file-preview-iframe');
                            const modalTitle = document.getElementById('modal-file-title');

                            modalTitle.textContent = file.name;
                            iframe.src = `https://drive.google.com/file/d/${file.id}/preview`;
                            previewModal.style.display = 'flex';
                        }
                    });

                    container.appendChild(item);
                });
            })
            .catch(error => {
                container.innerHTML = '<p class="text-center" style="color: #ff5f56;">Falha de conexão com a API do Google Drive.</p>';
                console.error(error);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const rootHtml = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    if (currentTheme === 'dark') {
        rootHtml.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = rootHtml.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                rootHtml.setAttribute('data-theme', 'dark');
            } else {
                rootHtml.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        const paths = {
            light: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', // Moon icon
            dark: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' // Sun icon
        };
        
        document.querySelectorAll('.theme-toggle-btn svg').forEach(svg => {
            if (theme === 'dark') {
                 svg.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
            } else {
                 svg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
            }
        });
    }
});
