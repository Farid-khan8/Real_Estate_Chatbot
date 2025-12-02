import pandas as pd
import os
from django.conf import settings

class RealEstateData:
    """Simple data handler for Excel files"""
    _instance = None
    _data = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def load_data(self, file_path=None):
        """Load Excel data from file or create sample"""
        if file_path and os.path.exists(file_path):
            try:
                self._data = pd.read_excel(file_path)
                self._data.columns = [col.strip().lower().replace(' ', '_') for col in self._data.columns]
                return True
            except Exception as e:
                print(f"Error loading file: {e}")
        
        # Create sample data
        self._create_sample_data()
        return False
    
    def _create_sample_data(self):
        """Create realistic sample data for Pune areas"""
        years = list(range(2020, 2025))
        areas = ['Wakad', 'Aundh', 'Akurdi', 'Ambegaon Budruk', 'Baner', 'Hinjewadi']
        
        data = []
        for area in areas:
            for year in years:
                # Base prices per area
                base_prices = {
                    'Wakad': 5500, 'Aundh': 7000, 'Akurdi': 4500,
                    'Ambegaon Budruk': 4000, 'Baner': 8000, 'Hinjewadi': 6000
                }
                
                # Calculate price with 8% annual growth
                years_since_2020 = year - 2020
                base_price = base_prices[area]
                price = int(base_price * (1 + 0.08) ** years_since_2020)
                
                data.append({
                    'year': year,
                    'area': area,
                    'price_per_sqft': price,
                    'demand_index': min(100, 60 + (years_since_2020 * 8)),
                    'total_units': 100 + (years_since_2020 * 25),
                    'avg_property_size': 1000 + (years_since_2020 * 100),
                    'supply_index': 70 + (years_since_2020 * 6)
                })
        
        self._data = pd.DataFrame(data)
        print("Created sample data with areas:", areas)
    
    def get_areas(self):
        """Get list of unique areas"""
        if self._data is None:
            self._create_sample_data()
        return sorted(self._data['area'].unique().tolist())
    
    def analyze_area(self, area_name):
        """Get analysis for a specific area"""
        if self._data is None:
            self._create_sample_data()
        
        area_data = self._data[self._data['area'].str.lower() == area_name.lower()]
        if area_data.empty:
            return None
        
        return area_data.to_dict('records')
    
    def compare_areas(self, area1, area2):
        """Compare two areas"""
        if self._data is None:
            self._create_sample_data()
        
        area1_data = self._data[self._data['area'].str.lower() == area1.lower()]
        area2_data = self._data[self._data['area'].str.lower() == area2.lower()]
        
        if area1_data.empty or area2_data.empty:
            return None
        
        return {
            'area1': area1_data.to_dict('records'),
            'area2': area2_data.to_dict('records')
        }
    
    def get_trend(self, area_name, years=3):
        """Get trend for specific number of years"""
        if self._data is None:
            self._create_sample_data()
        
        current_year = 2024  # Can be made dynamic
        start_year = current_year - years + 1
        
        area_data = self._data[
            (self._data['area'].str.lower() == area_name.lower()) & 
            (self._data['year'] >= start_year)
        ]
        
        if area_data.empty:
            return None
        
        return area_data.to_dict('records')