import React, { createContext, useContext, useState, useEffect } from 'react';

interface CoupleContextType {
    coupleCode: string | null;
    setCode: (code: string) => void;
    clearCode: () => void;
}

const CoupleContext = createContext<CoupleContextType>({
    coupleCode: null,
    setCode: () => {},
    clearCode: () => {}
});

export const useCouple = () => useContext(CoupleContext);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coupleCode, setCoupleCode] = useState<string | null>(() => {
        // Load code from localStorage on startup
        const saved = localStorage.getItem('coupleCode');
        return saved || null;
    });

    const setCode = (code: string) => {
        localStorage.setItem('coupleCode', code);
        setCoupleCode(code);
    };

    const clearCode = () => {
        localStorage.removeItem('coupleCode');
        setCoupleCode(null);
    };

    return (
        <CoupleContext.Provider value={{ coupleCode, setCode, clearCode }}>
            {children}
        </CoupleContext.Provider>
    );
};
