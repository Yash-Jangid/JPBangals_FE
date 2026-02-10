import React, { useState, useCallback, useContext } from 'react';
import { AlertContext, AlertOptions, AlertContextType } from './AlertTypes';
import { CustomAlert } from './CustomAlert';

export const CustomAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions | null>(null);

    const showAlert = useCallback((opts: AlertOptions) => {
        setOptions(opts);
        setVisible(true);
    }, []);

    const hideAlert = useCallback(() => {
        setVisible(false);
        if (options?.onDismiss) {
            options.onDismiss();
        }
    }, [options]);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <CustomAlert
                visible={visible}
                options={options}
                onClose={hideAlert}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within a CustomAlertProvider');
    }
    return context;
};
