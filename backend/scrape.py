import requests
from bs4 import BeautifulSoup
from urllib.parse import urlencode


def scrape_car_listings(brand, model, year, price, mileage, zip_code, maximum_distance):
    # Construct the URL for the search
    base_url = "https://www.cars.com/shopping/results/"
    query_params = {
        'stock_type': 'all',
        'makes[]': brand.lower(),
        'models[]': f"{brand.lower()}-{model.lower()}",
        'year_min': year,
        'year_max': year,
        'list_price_max': price,
        'mileage_max': mileage,
        'zip': zip_code,
        'maximum_distance': maximum_distance
    }
    url = f"{base_url}?{urlencode(query_params)}"
    print(url)

    # Perform the HTTP request to get the page content
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Parse the HTML to extract car listings
    listings = []
    for listing in soup.find_all('div', class_='vehicle-card'):
        details_url = 'https://www.cars.com' + listing.find('a', class_='vehicle-card-link')['href']
        title = listing.find('h2').text.strip() if listing.find('h2') else 'No Title'
        price = listing.find('span', class_='primary-price').text.strip() if listing.find('span',
                                                                                          class_='primary-price') else 'Call for Price'

        mileage = listing.find('div', class_='mileage').text.strip() if listing.find('div',
                                                                                     class_='mileage') else 'N/A'
        dealer = listing.find('div', class_='dealer-name').text.strip() if listing.find('div',
                                                                                        class_='dealer-name') else 'N/A'

        detail_response = requests.get(details_url, headers=headers)
        detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
        image_elements = listing.find_all('img', class_='vehicle-image js-lazy-load styles-lazy-load')
        images = [img.get('data-src', img['src']) for img in image_elements if 'src' in img.attrs]
        dealer_link_element = detail_soup.find('a', attrs={'data-linkname': 'dealer-external-site-listing'})
        if not dealer_link_element:
            dealer_link_element = detail_soup.find('a', attrs={'data-linkname': 'dealer-external-site'})
        dealer_url = dealer_link_element[
            'href'] if dealer_link_element and 'href' in dealer_link_element.attrs else 'N/A'

        car_info = {
            'title': title,
            'price': price,
            'mileage': mileage,
            'dealer': dealer,
            'images': images,
            'dealer_url': dealer_url
        }
        listings.append(car_info)

    return listings