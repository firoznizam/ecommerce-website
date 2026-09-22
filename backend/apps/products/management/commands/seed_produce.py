from django.core.management.base import BaseCommand
from apps.categories.models import Category
from apps.products.models import Product, MandiDailyPrice
from datetime import date


class Command(BaseCommand):
    help = 'Seeds initial Kerala fresh produce categories and vegetable items'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding initial produce and categories...')

        categories_data = [
            {
                'name': 'Traditional Kerala Vegetables',
                'slug': 'traditional-kerala',
                'description': 'Authentic native Kerala vegetables sourced directly from local farmers in Idukki, Wayanad, and Palakkad.',
                'image': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
            },
            {
                'name': 'Roots & Tubers',
                'slug': 'roots-tubers',
                'description': 'Freshly harvested elephant foot yam, taro roots, and tapioca from fertile Kerala soils.',
                'image': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600',
            },
            {
                'name': 'Leafy Greens & Keera',
                'slug': 'leafy-greens',
                'description': 'Crisp, nutrient-dense pesticide-free leafy greens and fresh moringa leaves harvested at dawn.',
                'image': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600',
            },
            {
                'name': 'Gourds & Cucurbits',
                'slug': 'gourds-cucurbits',
                'description': 'Fresh ash gourd, snake gourd, bitter gourd, and ivy gourd for traditional avial, sambar, and thoran.',
                'image': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
            },
            {
                'name': 'Daily Cooking Staples',
                'slug': 'daily-staples',
                'description': 'Onions, shallots (cheriya ulli), tomatoes, and green chillies delivered fresh every morning.',
                'image': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600',
            },
        ]

        cat_map = {}
        for c in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=c['slug'],
                defaults=c
            )
            cat_map[c['slug']] = cat

        products_data = [
            {
                'name': 'Elephant Foot Yam (Chena)',
                'slug': 'elephant-foot-yam-chena',
                'malayalam_name': 'ചേന',
                'category': cat_map['roots-tubers'],
                'description': 'Rich, starchy traditional Kerala elephant foot yam harvested from the loamy soils of central Kerala. Perfect for authentic Erissery and Chena Mezhukkupuratti.',
                'price': 48.00,
                'discount_price': 38.00,
                'stock_quantity': 350,
                'image': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600',
                'unit': 'kg',
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Fresh Drumstick / Moringa Pods',
                'slug': 'fresh-drumstick-moringa-pods',
                'malayalam_name': 'മുരിങ്ങക്കായ',
                'category': cat_map['traditional-kerala'],
                'description': 'Tender, fleshy green moringa pods bursting with natural sweetness and aromatic flavor. Indispensable for Kerala Sambar and Avial.',
                'price': 65.00,
                'discount_price': 52.00,
                'stock_quantity': 220,
                'image': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
                'unit': 'kg',
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Fresh Moringa Leaves (Muringayila)',
                'slug': 'fresh-moringa-leaves-muringayila',
                'malayalam_name': 'മുരിങ്ങയില',
                'category': cat_map['leafy-greens'],
                'description': 'Freshly clipped young moringa twigs packed with vitamins, iron, and antioxidants. Cleaned and batched for quick cooking.',
                'price': 25.00,
                'discount_price': 18.00,
                'stock_quantity': 120,
                'image': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600',
                'unit': 'bunch',
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Kerala Ash Gourd (Kumbalanga)',
                'slug': 'kerala-ash-gourd-kumbalanga',
                'malayalam_name': 'കുമ്പളങ്ങ',
                'category': cat_map['gourds-cucurbits'],
                'description': 'Cooling, nutrient-rich ash gourd with snowy white flesh. Ideal for authentic Olan, Moru Curry, and cooling summer juices.',
                'price': 34.00,
                'discount_price': 28.00,
                'stock_quantity': 400,
                'image': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
                'unit': 'kg',
                'is_featured': False,
                'is_active': True,
            },
            {
                'name': 'Kerala Small Shallots (Cheriya Ulli)',
                'slug': 'kerala-small-shallots-cheriya-ulli',
                'malayalam_name': 'ചെറിയ ഉള്ളി / ചുവന്നുള്ളി',
                'category': cat_map['daily-staples'],
                'description': 'Pungent, deeply aromatic Kerala small red onions. Essential tempering element for Sambar, Theeyal, Fish curry, and Varutharacha dishes.',
                'price': 72.00,
                'discount_price': 58.00,
                'stock_quantity': 600,
                'image': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600',
                'unit': 'kg',
                'is_featured': True,
                'is_active': True,
            },
            {
                'name': 'Bitter Gourd (Pavakka)',
                'slug': 'bitter-gourd-pavakka',
                'malayalam_name': 'പാവയ്ക്ക',
                'category': cat_map['gourds-cucurbits'],
                'description': 'Fresh dark-green serrated bitter gourd. Perfect for crispy Pavakka fry and traditional sweet-sour-spicy Pavakka Pachadi.',
                'price': 55.00,
                'discount_price': 46.00,
                'stock_quantity': 180,
                'image': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
                'unit': 'kg',
                'is_featured': False,
                'is_active': True,
            },
        ]

        today = date.today()

        for p_data in products_data:
            prod, _ = Product.objects.update_or_create(
                slug=p_data['slug'],
                defaults=p_data
            )
            # Create Mandi rate record
            MandiDailyPrice.objects.update_or_create(
                product=prod,
                auction_date=today,
                mandi_hub='Ernakulam Central Mandi',
                defaults={
                    'morning_retail_rate': prod.price,
                    'morning_wholesale_rate': prod.discount_price or prod.price,
                    'volume_trend': 'Strong Fresh Arrival',
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded categories and products!'))
