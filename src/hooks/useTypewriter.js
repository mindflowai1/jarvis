import { useState, useEffect } from 'react';

export const useTypewriter = (textArray, typingSpeed = 150, deletingSpeed = 100, pauseDuration = 2000) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentFullText = textArray[currentIndex];

        const handleTyping = () => {
            if (isDeleting) {
                setDisplayText(prev => prev.substring(0, prev.length - 1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setCurrentIndex(prev => (prev + 1) % textArray.length);
                }
            } else {
                setDisplayText(currentFullText.substring(0, displayText.length + 1));
                if (displayText === currentFullText) {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                    return;
                }
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentIndex, textArray, typingSpeed, deletingSpeed, pauseDuration]);

    return displayText;
};
