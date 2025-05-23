import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { getCoupleData, saveCoupleData } from '../utils/storageManager';
import { isNativeMobile } from '../utils/mobileUtils';

interface CoupleContextType {
    coupleCode: string | null;
    setCode: (code: string) => void;
    clearCode: () => void;
    isLoading: boolean;
}

const CoupleContext = createContext<CoupleContextType>({
    coupleCode: null,
    setCode: () => {},
    clearCode: () => {},
    isLoading: true
});

export const useCouple = () => useContext(CoupleContext);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coupleCode, setCoupleCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Load couple code using our storage system
    useEffect(() => {
        const loadCoupleCode = async () => {
            setIsLoading(true);
            try {
                const code = await getCoupleData();
                setCoupleCode(code);
            } catch (error) {
                console.error('Error loading couple code:', error);
                // Fallback to localStorage
                const saved = localStorage.getItem('coupleCode');
                setCoupleCode(saved);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadCoupleCode();
    }, []);

    const setCode = async (code: string) => {
        setCoupleCode(code);
        try {
            // Save using our storage system (works on both web and iOS)
            await saveCoupleData(code);
        } catch (error) {
            console.error('Error saving couple code:', error);
            // Fallback to localStorage
            localStorage.setItem('coupleCode', code);
        }
    };

    const clearCode = async () => {
        setCoupleCode(null);
        try {
            // Clear from our storage system
            await saveCoupleData('');
            localStorage.removeItem('coupleCode');
            
            // For iOS, clear from Capacitor Storage too
            if (isNativeMobile()) {
                try {
                    // Use the new Preferences API
                    await Preferences.remove({ key: 'coupleCode' });
                } catch (error) {
                    console.error('Error clearing coupleCode from Capacitor preferences:', error);
                }
            }
        } catch (error) {
            console.error('Error clearing couple code:', error);
            // Fallback to just localStorage
            localStorage.removeItem('coupleCode');
        }
    };

    return (
        <CoupleContext.Provider value={{ coupleCode, setCode, clearCode, isLoading }}>
            {children}
        </CoupleContext.Provider>
    );
};
