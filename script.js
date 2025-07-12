// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = 'demo'; // Using demo mode for now
        this.currentUnit = 'celsius';
        this.currentCity = 'Mumbai';
        this.indianCities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
            'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
            'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
            'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
            'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
            'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
            'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
            'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
            'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur',
            'Hubli-Dharwad', 'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur'
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadWeatherData(this.currentCity);
        this.loadCitiesWeather();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000); // Update every minute
    }

    setupEventListeners() {
        // Search functionality
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const suggestions = document.getElementById('suggestions');

        cityInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather(e.target.value);
            }
        });
        searchBtn.addEventListener('click', () => this.searchWeather(cityInput.value));

        // Temperature unit toggle
        document.getElementById('celsiusBtn').addEventListener('click', () => this.toggleUnit('celsius'));
        document.getElementById('fahrenheitBtn').addEventListener('click', () => this.toggleUnit('fahrenheit'));

        // City cards click
        document.querySelectorAll('.city-card').forEach(card => {
            card.addEventListener('click', () => {
                const city = card.dataset.city;
                this.loadWeatherData(city);
                this.currentCity = city;
                cityInput.value = city;
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const target = link.getAttribute('href').substring(1);
                document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    handleSearch(query) {
        const suggestions = document.getElementById('suggestions');
        
        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }

        const filteredCities = this.indianCities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filteredCities.length > 0) {
            suggestions.innerHTML = filteredCities.map(city => 
                `<div class="suggestion-item" onclick="weatherApp.selectCity('${city}')">${city}</div>`
            ).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    }

    selectCity(city) {
        document.getElementById('cityInput').value = city;
        document.getElementById('suggestions').style.display = 'none';
        this.searchWeather(city);
    }

    searchWeather(city) {
        if (city.trim()) {
            this.loadWeatherData(city.trim());
            this.currentCity = city.trim();
        }
    }

    async loadWeatherData(city) {
        this.showLoading();
        
        try {
            // Since we're in demo mode, we'll use mock data
            const weatherData = this.getMockWeatherData(city);
            this.displayCurrentWeather(weatherData);
            this.displayForecast(weatherData.forecast);
            this.updateBackgroundTheme(weatherData.current.condition);
        } catch (error) {
            this.showError('Failed to load weather data. Please try again.');
        }
    }

    getMockWeatherData(city) {
        // Mock weather data for demonstration
        const conditions = ['clear', 'cloudy', 'rainy', 'partly-cloudy', 'thunderstorm'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        const baseTemp = this.getCityBaseTemp(city);
        const variation = (Math.random() - 0.5) * 10;
        const currentTemp = Math.round(baseTemp + variation);
        
        return {
            current: {
                city: city,
                temperature: currentTemp,
                feelsLike: currentTemp + Math.round((Math.random() - 0.5) * 6),
                condition: randomCondition,
                description: this.getWeatherDescription(randomCondition),
                humidity: Math.round(40 + Math.random() * 40),
                windSpeed: Math.round(5 + Math.random() * 20),
                pressure: Math.round(1000 + Math.random() * 50),
                visibility: Math.round(5 + Math.random() * 15),
                uvIndex: Math.round(1 + Math.random() * 10),
                cloudCover: Math.round(Math.random() * 100),
                icon: this.getWeatherIcon(randomCondition)
            },
            forecast: this.generateForecast(baseTemp)
        };
    }

    getCityBaseTemp(city) {
        // Base temperatures for different Indian cities (in Celsius)
        const cityTemps = {
            'Mumbai': 28, 'Delhi': 32, 'Bangalore': 24, 'Chennai': 30,
            'Kolkata': 29, 'Hyderabad': 27, 'Pune': 26, 'Ahmedabad': 33,
            'Jaipur': 31, 'Surat': 30, 'Lucknow': 30, 'Kanpur': 31,
            'Nagpur': 29, 'Indore': 28, 'Bhopal': 27, 'Patna': 30,
            'Vadodara': 32, 'Ghaziabad': 32, 'Ludhiana': 28, 'Agra': 31,
            'Nashik': 27, 'Faridabad': 32, 'Meerut': 31, 'Rajkot': 31,
            'Varanasi': 30, 'Srinagar': 18, 'Aurangabad': 28, 'Amritsar': 27,
            'Allahabad': 30, 'Ranchi': 26, 'Coimbatore': 26, 'Jabalpur': 28,
            'Gwalior': 30, 'Vijayawada': 29, 'Jodhpur': 33, 'Madurai': 29,
            'Raipur': 28, 'Kota': 32, 'Chandigarh': 28, 'Guwahati': 26,
            'Tiruchirappalli': 30, 'Mysore': 25, 'Bareilly': 30
        };
        
        return cityTemps[city] || 28; // Default to 28°C if city not found
    }

    getWeatherDescription(condition) {
        const descriptions = {
            'clear': 'Clear Sky',
            'cloudy': 'Cloudy',
            'rainy': 'Light Rain',
            'partly-cloudy': 'Partly Cloudy',
            'thunderstorm': 'Thunderstorm'
        };
        return descriptions[condition] || 'Pleasant Weather';
    }

    getWeatherIcon(condition) {
        const icons = {
            'clear': 'https://openweathermap.org/img/wn/01d@2x.png',
            'cloudy': 'https://openweathermap.org/img/wn/04d@2x.png',
            'rainy': 'https://openweathermap.org/img/wn/10d@2x.png',
            'partly-cloudy': 'https://openweathermap.org/img/wn/02d@2x.png',
            'thunderstorm': 'https://openweathermap.org/img/wn/11d@2x.png'
        };
        return icons[condition] || icons['clear'];
    }

    generateForecast(baseTemp) {
        const forecast = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const conditions = ['clear', 'cloudy', 'rainy', 'partly-cloudy'];
        
        for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            const dayTemp = baseTemp + (Math.random() - 0.5) * 8;
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            
            forecast.push({
                day: days[date.getDay()],
                date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                high: Math.round(dayTemp + Math.random() * 5),
                low: Math.round(dayTemp - Math.random() * 8),
                condition: condition,
                description: this.getWeatherDescription(condition),
                icon: this.getWeatherIcon(condition)
            });
        }
        
        return forecast;
    }

    displayCurrentWeather(data) {
        const { current } = data;
        
        document.getElementById('cityName').textContent = current.city;
        document.getElementById('currentTemp').textContent = this.formatTemperature(current.temperature);
        document.getElementById('weatherDesc').textContent = current.description;
        document.getElementById('feelsLike').textContent = `Feels like ${this.formatTemperature(current.feelsLike)}`;
        document.getElementById('humidity').textContent = `${current.humidity}%`;
        document.getElementById('windSpeed').textContent = `${current.windSpeed} km/h`;
        document.getElementById('pressure').textContent = `${current.pressure} hPa`;
        document.getElementById('visibility').textContent = `${current.visibility} km`;
        document.getElementById('uvIndex').textContent = current.uvIndex;
        document.getElementById('cloudCover').textContent = `${current.cloudCover}%`;
        document.getElementById('weatherIcon').src = current.icon;
        document.getElementById('weatherIcon').alt = current.description;
        
        this.hideLoading();
    }

    displayForecast(forecast) {
        const container = document.getElementById('forecastContainer');
        container.innerHTML = forecast.map(day => `
            <div class="forecast-card">
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-date">${day.date}</div>
                <img src="${day.icon}" alt="${day.description}" class="forecast-icon">
                <div class="forecast-temps">
                    <span class="forecast-high">${this.formatTemperature(day.high)}</span>
                    <span class="forecast-low">${this.formatTemperature(day.low)}</span>
                </div>
                <div class="forecast-desc">${day.description}</div>
            </div>
        `).join('');
    }

    async loadCitiesWeather() {
        const cityCards = document.querySelectorAll('.city-card');
        
        cityCards.forEach(async (card, index) => {
            // Simulate loading delay
            setTimeout(() => {
                const city = card.dataset.city;
                const baseTemp = this.getCityBaseTemp(city);
                const temp = Math.round(baseTemp + (Math.random() - 0.5) * 6);
                
                const tempElement = card.querySelector('.city-temp');
                const iconElement = card.querySelector('.city-icon');
                
                tempElement.textContent = this.formatTemperature(temp);
                
                // Random weather icon
                const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun'];
                const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                iconElement.className = `city-icon fas ${randomIcon}`;
            }, index * 200); // Stagger the loading
        });
    }

    toggleUnit(unit) {
        this.currentUnit = unit;
        
        // Update button states
        document.getElementById('celsiusBtn').classList.toggle('active', unit === 'celsius');
        document.getElementById('fahrenheitBtn').classList.toggle('active', unit === 'fahrenheit');
        
        // Reload current weather with new unit
        this.loadWeatherData(this.currentCity);
        this.loadCitiesWeather();
    }

    formatTemperature(temp) {
        if (this.currentUnit === 'fahrenheit') {
            return `${Math.round((temp * 9/5) + 32)}°F`;
        }
        return `${temp}°C`;
    }

    updateBackgroundTheme(condition) {
        const body = document.body;
        const rainContainer = document.querySelector('.rain-container');
        
        // Remove existing weather classes
        body.classList.remove('sunny', 'rainy', 'cloudy', 'stormy', 'snowy');
        rainContainer.classList.remove('active');
        
        // Add appropriate class based on condition
        switch (condition) {
            case 'clear':
                body.classList.add('sunny');
                break;
            case 'rainy':
                body.classList.add('rainy');
                rainContainer.classList.add('active');
                break;
            case 'cloudy':
                body.classList.add('cloudy');
                break;
            case 'thunderstorm':
                body.classList.add('stormy');
                rainContainer.classList.add('active');
                // Add lightning effect
                setTimeout(() => body.classList.add('lightning'), 1000);
                break;
            case 'partly-cloudy':
            default:
                // Keep default gradient
                break;
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        };
        
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-IN', options);
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherContent').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('weatherContent').style.display = 'block';
    }

    showError(message) {
        this.hideLoading();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        const weatherCard = document.querySelector('.weather-card');
        weatherCard.insertBefore(errorDiv, weatherCard.firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Additional utility functions
function addWeatherAnimations() {
    // Add floating animation to weather icons
    const weatherIcons = document.querySelectorAll('.weather-icon img, .forecast-icon');
    weatherIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for scroll animations
    document.querySelectorAll('.weather-card, .forecast-card, .city-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function addParticleEffect() {
    // Add subtle particle effect for enhanced visual appeal
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float ${10 + Math.random() * 20}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 10}s;
        `;
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
    
    // Add enhanced animations after a short delay
    setTimeout(() => {
        addWeatherAnimations();
        addScrollAnimations();
        addParticleEffect();
    }, 1000);
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('suggestions').style.display = 'none';
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            document.getElementById('suggestions').style.display = 'none';
        }
    });
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}