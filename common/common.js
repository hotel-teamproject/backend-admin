// src/utils/common.js
// 공통 유틸: apiFetch(공통), error handling, cookie helpers (선택), constants

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * 공통 fetch 래퍼
 * - credentials: 'include' 기본 (서버가 httpOnly 쿠키를 사용하면 필요)
 * - 자동 JSON 파싱, 에러 처리
 */
export async function apiFetch(path, { method = 'GET', body = null, headers = {}, credentials = 'include' } = {}) {
    const opts = {
        method,
        credentials,
        headers: { 'Content-Type': 'application/json', ...headers }
    };
    if (body != null) opts.body = typeof body === 'string' ? body : JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, opts);
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const err = new Error(data?.message || res.statusText || 'API error');
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

/**
 * 안전한 호출 헬퍼 (에러 메시지 추출 + 알림 연동 가능)
 */
export async function safeApiFetch(path, opts = {}) {
    try {
        return await apiFetch(path, opts);
    } catch (err) {
        // 여기에 Sentry, toast 등 로깅/알림 연결 가능
        console.error('API Error', err);
        throw err;
    }
}

/**
 * 간단 쿠키 유틸 (httpOnly 쿠키인 경우 클라이언트에서 접근 불가하므로
 * 백엔드가 httpOnly 쿠키를 쓴다면 이 함수는 토큰 접근 용도로는 의미가 없습니다.)
 */
export function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}
export function getCookie(name) {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? decodeURIComponent(v.pop()) : null;
}
export function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

export const COMMON = {
    API_BASE
};

export default {
    apiFetch,
    safeApiFetch,
    setCookie,
    getCookie,
    eraseCookie,
    COMMON
};