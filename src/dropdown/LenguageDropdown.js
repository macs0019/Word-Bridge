import React, { useState } from 'react';
import './LenguageDropdown.css'
import ReactCountryFlag from "react-country-flag"

// Lista de idiomas y sus emojis de banderas
const languages = [
  { code: 'us', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: 'de' },
  { code: 'fr', name: 'French', flag: 'fr' },
  { code: 'it', name: 'Italian', flag: 'it' },
  { code: 'cn', name: 'Chinese', flag: 'zh' },
];

const LanguageDropdown = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    reduce();

  }

  const reduce = () => {
    const elementos = document.querySelectorAll('.flag-icon-drop');

    // Recorre cada elemento y añade la clase 'hide'
    if (!isOpen) {
      elementos.forEach(elemento => {
        elemento.classList.remove('hidding');
        elemento.classList.remove('hide');
        elemento.classList.add('show');
      });
    } else {
      elementos.forEach(elemento => {
        elemento.classList.remove('hidding');
        elemento.classList.remove('show');
        elemento.classList.add('hide');
      });
    }
  }

  const selectLanguage = (language) => {
    // Selecciona todos los elementos con la clase 'mi-elemento'
    if (isOpen) {
      if (language != selectLanguage) {
        setSelectedLanguage(language);
        setLanguage(language.code);
      }
      reduce();
      setIsOpen(false);
    }
  };

  return (
    <div className="language-dropdown">
      <button onClick={toggleDropdown} style={{ width: '3rem', display: 'flex', justifyContent: 'center' }}>
        <span className="flag-emoji" style={{ display: 'flex', justifyContent: 'center' }}>
          <ReactCountryFlag
            countryCode={selectedLanguage.code}
            svg
            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
            cdnSuffix="svg"
            title={selectedLanguage.code}
            style={{ fontSize: '1.5rem', display: 'flex', justifyContent: 'center', borderRadius: '50px', border: '3px solid #333' }}
          />
        </span>
      </button>
      {(
        <ul>
          {languages.map((language) => (
            <li key={language.code} onClick={() => selectLanguage(language)} style={{ cursor: isOpen ? 'pointer' : 'default' }}>
              <span className="flag-emoji">
                <ReactCountryFlag
                  countryCode={language.code}
                  svg
                  cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                  cdnSuffix="svg"
                  title={language.code}
                  style={{ fontSize: '1.5rem', display: 'flex', justifyContent: 'center', borderRadius: '50px', border: '3px solid #333' }}
                  className='flag-icon-drop hidding'
                />
              </span>
            </li>
          ))}
        </ul>
      )
      }
    </div >
  );
};

export default LanguageDropdown;