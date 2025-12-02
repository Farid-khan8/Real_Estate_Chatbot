from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import re
from .models import RealEstateData

class ChatbotAPI(APIView):
    def post(self, request):
        query = request.data.get('query', '').strip().lower()
        
        if not query:
            return Response({'error': 'No query provided'}, status=400)
        
        data_handler = RealEstateData()
        
        # Simple query parsing
        if 'compare' in query and 'and' in query:
            # Extract two areas after 'compare' and before/after 'and'
            match = re.search(r'compare\s+(.+?)\s+and\s+(.+)', query)
            if match:
                area1, area2 = match.groups()
                return self.handle_comparison(area1.strip(), area2.strip(), data_handler)
        
        if 'analyze' in query or 'analysis' in query:
            # Extract area name after analyze/analysis
            match = re.search(r'(?:analyze|analysis of|analysis for)\s+(.+)', query)
            if match:
                area = match.group(1).strip()
                return self.handle_analysis(area, data_handler)
        
        if 'price growth' in query or 'trend' in query:
            # Extract area and years
            match = re.search(r'(.+?)\s+over the last\s+(\d+)\s+years', query)
            if match:
                area = match.group(1).strip()
                years = int(match.group(2))
                return self.handle_trend(area, years, data_handler)
        
        # Default: show available areas
        areas = data_handler.get_areas()
        return Response({
            'type': 'general',
            'summary': f"I can analyze real estate data. Available areas: {', '.join(areas)}. Try: 'Analyze Wakad' or 'Compare Aundh and Baner'",
            'areas': areas
        })
    
    def handle_analysis(self, area, data_handler):
        data = data_handler.analyze_area(area)
        
        if not data:
            return Response({
                'type': 'error',
                'summary': f"Area '{area}' not found in data."
            })
        
        # Generate summary
        latest = data[-1]  # Most recent year
        summary = f"""
        📊 Analysis for {area}:
        
        • Current Price: ₹{latest['price_per_sqft']:,} per sq.ft
        • Demand Index: {latest['demand_index']}/100
        • Available Units: {latest['total_units']}
        • Avg Property Size: {latest['avg_property_size']} sq.ft
        
        Price has grown from ₹{data[0]['price_per_sqft']:,} in {data[0]['year']} 
        to ₹{latest['price_per_sqft']:,} in {latest['year']}.
        """
        
        # Prepare chart data
        chart_data = {
            'labels': [str(d['year']) for d in data],
            'price': [d['price_per_sqft'] for d in data],
            'demand': [d['demand_index'] for d in data],
            'units': [d['total_units'] for d in data]
        }
        
        return Response({
            'type': 'analysis',
            'area': area,
            'summary': summary,
            'chart_data': chart_data,
            'table_data': data
        })
    
    def handle_comparison(self, area1, area2, data_handler):
        data = data_handler.compare_areas(area1, area2)
        
        if not data:
            return Response({
                'type': 'error',
                'summary': f"Could not compare '{area1}' and '{area2}'. One or both areas not found."
            })
        
        area1_data = data['area1']
        area2_data = data['area2']
        
        # Get latest data for each area
        latest1 = area1_data[-1]
        latest2 = area2_data[-1]
        
        price_diff = latest2['price_per_sqft'] - latest1['price_per_sqft']
        price_diff_pct = (price_diff / latest1['price_per_sqft']) * 100
        
        summary = f"""
        ⚖️ Comparison: {area1} vs {area2}
        
        • Price Difference: ₹{abs(price_diff):,} ({price_diff_pct:+.1f}%)
        • Current Prices: 
          - {area1}: ₹{latest1['price_per_sqft']:,}/sq.ft
          - {area2}: ₹{latest2['price_per_sqft']:,}/sq.ft
        • Demand Comparison:
          - {area1}: {latest1['demand_index']}/100
          - {area2}: {latest2['demand_index']}/100
        
        {'Higher' if price_diff > 0 else 'Lower'} priced area: {area2 if price_diff > 0 else area1}
        """
        
        # Prepare comparison chart data
        chart_data = {
            'labels': [str(d['year']) for d in area1_data],
            'area1_price': [d['price_per_sqft'] for d in area1_data],
            'area2_price': [d['price_per_sqft'] for d in area2_data],
            'area1_demand': [d['demand_index'] for d in area1_data],
            'area2_demand': [d['demand_index'] for d in area2_data]
        }
        
        return Response({
            'type': 'comparison',
            'areas': [area1, area2],
            'summary': summary,
            'chart_data': chart_data,
            'table_data': {'area1': area1_data, 'area2': area2_data}
        })
    
    def handle_trend(self, area, years, data_handler):
        data = data_handler.get_trend(area, years)
        
        if not data:
            return Response({
                'type': 'error',
                'summary': f"No trend data found for '{area}' over the last {years} years."
            })
        
        first_year = data[0]['year']
        last_year = data[-1]['year']
        price_growth = data[-1]['price_per_sqft'] - data[0]['price_per_sqft']
        growth_pct = (price_growth / data[0]['price_per_sqft']) * 100
        
        summary = f"""
        📈 {years}-Year Trend Analysis for {area}:
        
        • Period: {first_year} to {last_year}
        • Price Growth: ₹{price_growth:,} ({growth_pct:+.1f}%)
        • Starting Price: ₹{data[0]['price_per_sqft']:,}
        • Current Price: ₹{data[-1]['price_per_sqft']:,}
        • Annual Growth Rate: {growth_pct/years:+.1f}%
        
        The area shows {'strong' if growth_pct > 30 else 'moderate' if growth_pct > 15 else 'steady'} growth.
        """
        
        chart_data = {
            'labels': [str(d['year']) for d in data],
            'price': [d['price_per_sqft'] for d in data],
            'demand': [d['demand_index'] for d in data]
        }
        
        return Response({
            'type': 'trend',
            'area': area,
            'years': years,
            'summary': summary,
            'chart_data': chart_data,
            'table_data': data
        })


class AreasAPI(APIView):
    """Simple API to get available areas"""
    def get(self, request):
        data_handler = RealEstateData()
        areas = data_handler.get_areas()
        return Response({'areas': areas})