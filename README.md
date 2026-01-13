# Clinical Diet & Enteral Feeding Calculator


A professional web application for calculating Ideal Body Weight (IBW), Resting Energy Expenditure (REE), and generating comprehensive enteral nutrition prescriptions.


## 🚀 Features


- **IBW Calculation**: Three validated methods (Hamwi, Devine, Robinson)
- **REE Calculation**: Five validated equations (Harris-Benedict, WHO, Owen, Mifflin-St Jeor, Liu)
- **Protein Requirements**: Customizable based on activity level and clinical goals
- **Product Selection**: 12 enteral nutrition products with detailed specifications
- **Advanced Filtering**: Filter by sodium content, caloric density, and protein levels
- **Dilution Calculator**: Half, standard, and double concentration options
- **Prescription Generation**: Professional diet prescriptions for nursing staff


## 📁 Project Structure


```
clinical-diet-calculator/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── data.js            # Product database and constants
├── calculations.js    # Core calculation functions
├── ui.js             # UI rendering and DOM manipulation
├── app.js            # Main application logic and state management
└── README.md         # This file
```


## 🏗️ Architecture


### Separation of Concerns


1. **HTML (index.html)**: Semantic markup only, no inline styles or scripts
2. **CSS (styles.css)**: All styling with CSS custom properties for theming
3. **JavaScript**:
   - `data.js`: Immutable data structures
   - `calculations.js`: Pure functions for calculations
   - `ui.js`: DOM manipulation and rendering
   - `app.js`: State management and event handling


### Design Patterns Used


- **Module Pattern**: Each JS file represents a distinct module
- **State Management**: Centralized AppState object
- **Pure Functions**: Calculation functions have no side effects
- **Immutability**: Product data is frozen with Object.freeze()
- **Event Delegation**: Efficient event handling
- **Separation of Concerns**: Logic, UI, and data are completely separated


## 🛠️ Best Practices Implemented


### Code Quality


- ✅ **No Code Duplication**: Reusable functions throughout
- ✅ **Clear Naming**: Descriptive variable and function names
- ✅ **Comments**: JSDoc-style documentation
- ✅ **Consistent Formatting**: Uniform code style
- ✅ **Error Handling**: Input validation and user feedback


### Performance


- ✅ **Efficient Rendering**: Only re-render what changes
- ✅ **Event Delegation**: Reduced event listeners
- ✅ **CSS Animations**: Hardware-accelerated transforms
- ✅ **Lazy Loading**: Sections shown only when needed


### Accessibility


- ✅ **Semantic HTML**: Proper heading hierarchy and landmarks
- ✅ **Form Labels**: All inputs properly labeled
- ✅ **Keyboard Navigation**: All interactive elements accessible
- ✅ **ARIA Labels**: Where appropriate
- ✅ **Color Contrast**: WCAG AA compliant


### Responsive Design


- ✅ **Mobile-First**: Works on all screen sizes
- ✅ **Flexible Layouts**: CSS Grid and Flexbox
- ✅ **Touch-Friendly**: Large tap targets (44x44px minimum)
- ✅ **Print Styles**: Optimized for printing prescriptions


## 📦 Deployment


### GitHub Pages


1. **Create a repository** on GitHub
2. **Upload all files** to the repository
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main (or master)
   - Folder: / (root)
4. **Access your site** at: `https://yourusername.github.io/repository-name`


### Alternative Hosting Options


#### Netlify
1. Drag and drop your folder to Netlify Drop
2. Get instant hosting with HTTPS


#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in project directory
3. Follow prompts


#### Cloudflare Pages
1. Connect your GitHub repository
2. Build settings: None needed (static site)
3. Deploy


## 🔧 Configuration


### Adding New Products


Edit `data.js`:


```javascript
{
    name: "Product Name",
    qty: 50,              // grams of powder
    dilution: 180,        // ml of water
    volume: 215,          // total ml after mixing
    calories: 224,        // kcal per serving
    protein: 10.5,        // g per serving
    fat: 7.75,           // g per serving
    cho: 28,             // carbohydrates g per serving
    sodium: 145,         // mg per serving
    potassium: 140,      // mg per serving
    phosphorus: 140,     // mg per serving
    features: "Description",
    preparation: "Instructions",
    scoopsText: "4 level scoops"
}
```


### Customizing Filter Thresholds


Edit `data.js`:


```javascript
const FILTER_THRESHOLDS = {
    LOW_SODIUM: 200,        // mg
    FLUID_RESTRICTION: 2.0, // cal/ml
    HIGH_PROTEIN: 15,       // g/100g
    LOW_PROTEIN: 12         // g/100g
};
```


### Changing Color Scheme


Edit CSS custom properties in `styles.css`:


```css
:root {
    --color-primary: #667eea;
    --color-secondary: #11998e;
    /* ... other colors */
}
```


## 📱 Browser Support


- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)


## 🐛 Troubleshooting


### Common Issues


**Problem**: Buttons not responding
- **Solution**: Ensure all 4 JS files are loaded in correct order


**Problem**: Styles not applying
- **Solution**: Clear browser cache (Ctrl+F5)


**Problem**: Products not showing
- **Solution**: Check browser console for errors


## 📈 Future Enhancements


Potential improvements:


- [ ] Save patient calculations to browser storage
- [ ] Export prescription as PDF
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Offline functionality (Service Worker)
- [ ] User authentication for saving history
- [ ] Database integration for product updates
- [ ] Print-optimized prescription layout


## 📄 License


This project is provided as-is for clinical use. Please ensure compliance with local healthcare regulations.


## 👨‍⚕️ Medical Disclaimer


This calculator is intended for use by qualified healthcare professionals. Always verify calculations and consult clinical guidelines before use.


## 🤝 Contributing


To contribute:


1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 📞 Support


For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review calculation formulas


## 🎯 Development Checklist


When making changes:


- [ ] Test on multiple browsers
- [ ] Verify responsive design on mobile
- [ ] Run validation on all inputs
- [ ] Check console for errors
- [ ] Test all user flows end-to-end
- [ ] Verify calculation accuracy
- [ ] Update documentation if needed


---


**Version**: 2.0.0  
**Last Updated**: 2025  
**Maintained by**: Healthcare IT Team