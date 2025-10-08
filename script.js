// DOM Elements
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');
const rememberMeCheckbox = document.querySelector('.checkbox');
const forgotPasswordLink = document.querySelector('.forgot-password a');
const signupLink = document.querySelector('.signup-link a');
const googleBtn = document.querySelector('.google');
const facebookBtn = document.querySelector('.facebook');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load saved credentials if "Remember me" was checked
    loadSavedCredentials();
    
    // Add event listeners
    addEventListeners();
    
    // Add some interactive effects
    addInteractiveEffects();
});

// Add event listeners
function addEventListeners() {
    // Phone input formatting
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // Password visibility toggle (double tap)
    passwordInput.addEventListener('dblclick', togglePasswordVisibility);
    
    // Remember me checkbox
    rememberMeCheckbox.addEventListener('click', toggleRememberMe);
    
    // Form validation
    phoneInput.addEventListener('blur', validatePhone);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Enter key to login
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// Format phone number as user types
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        } else if (value.length <= 9) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
        } else {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 12);
        }
    }
    e.target.value = value;
}

// Toggle password visibility
function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        setTimeout(() => {
            passwordInput.type = 'password';
        }, 2000);
    }
}

// Toggle remember me checkbox
function toggleRememberMe() {
    rememberMeCheckbox.classList.toggle('checked');
}

// Validate phone number
function validatePhone() {
    const phone = phoneInput.value.replace(/\D/g, '');
    const isValid = phone.length >= 10 && phone.length <= 15;
    
    if (!isValid && phone.length > 0) {
        showError(phoneInput, 'Please enter a valid phone number');
    } else {
        clearError(phoneInput);
    }
    
    return isValid;
}

// Validate password
function validatePassword() {
    const password = passwordInput.value;
    const isValid = password.length >= 6;
    
    if (!isValid && password.length > 0) {
        showError(passwordInput, 'Password must be at least 6 characters');
    } else {
        clearError(passwordInput);
    }
    
    return isValid;
}

// Show error message
function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 12px;
        margin-top: 5px;
        text-align: left;
    `;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ff6b6b';
}

// Clear error message
function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '';
}

// Handle login
function handleLogin() {
    const phone = phoneInput.value.replace(/\D/g, '');
    const password = passwordInput.value;
    
    // Validate inputs
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    
    if (!isPhoneValid || !isPasswordValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    if (phone.length === 0 || password.length === 0) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingState();
        
        // Save credentials if "Remember me" is checked
        if (rememberMeCheckbox.classList.contains('checked')) {
            saveCredentials(phone, password);
        }
        
        // Simulate successful login
        showNotification('Login successful!', 'success');
        
        // In a real app, you would redirect to the main app
        console.log('Login data:', { phone, password });
    }, 2000);
}

// Handle forgot password
function handleForgotPassword() {
    showNotification('Password reset link sent to your phone', 'info');
}

// Handle signup
function handleSignup() {
    showNotification('Redirecting to signup page...', 'info');
}

// Handle Google signup
function handleGoogleSignup() {
    showNotification('Redirecting to Google signup...', 'info');
}

// Handle Facebook signup
function handleFacebookSignup() {
    showNotification('Redirecting to Facebook signup...', 'info');
}

// Show loading state
function showLoadingState() {
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
}

// Hide loading state
function hideLoadingState() {
    loginBtn.innerHTML = 'Login';
    loginBtn.disabled = false;
    loginBtn.classList.remove('loading');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type]};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Save credentials to localStorage
function saveCredentials(phone, password) {
    const credentials = {
        phone: phone,
        password: password,
        timestamp: Date.now()
    };
    localStorage.setItem('kasome_credentials', JSON.stringify(credentials));
}

// Load saved credentials
function loadSavedCredentials() {
    const saved = localStorage.getItem('kasome_credentials');
    if (saved) {
        try {
            const credentials = JSON.parse(saved);
            // Check if credentials are not too old (7 days)
            if (Date.now() - credentials.timestamp < 7 * 24 * 60 * 60 * 1000) {
                phoneInput.value = credentials.phone;
                passwordInput.value = credentials.password;
                rememberMeCheckbox.classList.add('checked');
            } else {
                // Remove old credentials
                localStorage.removeItem('kasome_credentials');
            }
        } catch (e) {
            // Invalid data, remove it
            localStorage.removeItem('kasome_credentials');
        }
    }
}

// Add interactive effects
function addInteractiveEffects() {
    // Add ripple effect to buttons
    addRippleEffect(loginBtn);
    addRippleEffect(googleBtn);
    addRippleEffect(facebookBtn);
    
    // Add hover effects to input fields
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
}

// Add ripple effect to buttons
function addRippleEffect(button) {
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
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple animation
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .input-group.focused .input-field {
            border-color: #FFD700;
            box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
}

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.logo').addEventListener('click', function() {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 You found the secret! Welcome to Kasome App!', 'success');
        clickCount = 0;
    }
});

// Reset click count after 3 seconds
setInterval(() => {
    if (clickCount > 0) {
        clickCount = Math.max(0, clickCount - 1);
    }
}, 3000);