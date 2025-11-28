// src/api/auth.js
// 인증 관련 API 함수 모음
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function apiFetch(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const defaultOpts = {
        credentials: 'include', // 토큰이 쿠키로 전달되는 경우 필요
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    };
    const res = await fetch(url, defaultOpts);
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const err = new Error(data?.message || res.statusText || 'API error');
        err.status = res.status;
        err.response = data;
        throw err;
    }
    return data;
}

export async function login(email, password) {
    return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export async function register(payload) {
    // payload: { email, password, name, ... }
    return apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function logout() {
    return apiFetch('/api/auth/logout', {
        method: 'POST'
    });
}

export async function getProfile() {
    return apiFetch('/api/auth/profile', {
        method: 'GET'
    });
}

// 선택: 비밀번호 변경, 프로필 수정 등
export async function changePassword(oldPassword, newPassword) {
    return apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
    });
}

export async function updateProfile(data) {
    return apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export default {
    login,
    register,
    logout,
    getProfile,
    changePassword,
    updateProfile
};