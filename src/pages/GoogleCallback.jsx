import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleCallback() {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                // 1. Update state and localStorage
                login(user, token);

                // 2. Direct hard-redirect for maximum reliability and to clear URL params
                const target = user.role === 'admin' ? '/admin' : '/products';
                window.location.href = target;
            } catch (err) {
                console.error('Error in Google Login:', err);
                window.location.href = '/signin';
            }
        }
    }, [searchParams, login]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
            <div className="text-center p-10 bg-white rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 border border-gray-100">
                <div className="w-14 h-14 border-[5px] border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Redirecting...</h2>
                <p className="text-gray-500 font-medium leading-relaxed">Setting up your secure session elegantly.</p>

                <div className="mt-10 py-3 px-5 bg-gray-50 rounded-2xl text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest">
                    Verified Secure Access
                </div>
            </div>
        </div>
    );
}

export default GoogleCallback;
