from django.db import models
from django.core.validators import FileExtensionValidator

class POIType(models.TextChoices):
    CITY = 'CITY', 'Город/Село'
    POI = 'POI', 'Точка интереса'
    VIEWPOINT = 'VIEWPOINT', 'Смотровая площадка'
    SERVICE_GAS = 'SERVICE_GAS', 'АЗС'
    SERVICE_FOOD = 'SERVICE_FOOD', 'Кафе/Столовая'
    SERVICE_PARKING = 'SERVICE_PARKING', 'Парковка'
    SERVICE_TOILET = 'SERVICE_TOILET', 'Туалет'
    SERVICE_MEDICAL = 'SERVICE_MEDICAL', 'Медпункт'
    TRAIL_STEP = 'TRAIL_STEP', 'Точка экотропы'

class Language(models.TextChoices):
    RU = 'ru', 'Русский'
    EN = 'en', 'English'
    SAKHA = 'sah', 'Саха'

class AudioTrack(models.Model):
    id = models.CharField(max_length=50, primary_key=True, verbose_name='ID трека')
    title_ru = models.CharField(max_length=200, verbose_name='Название (рус)')
    title_en = models.CharField(max_length=200, blank=True, verbose_name='Название (англ)')
    title_sah = models.CharField(max_length=200, blank=True, verbose_name='Название (якут)')
    
    audio_file = models.FileField(
        upload_to='audio/',
        validators=[FileExtensionValidator(['mp3', 'aac', 'm4a'])],
        verbose_name='Аудиофайл'
    )
    
    duration = models.PositiveIntegerField(help_text='Длительность в секундах', verbose_name='Длительность')
    language = models.CharField(max_length=3, choices=Language.choices, default=Language.RU, verbose_name='Язык')
    
    volume_level = models.FloatField(default=-16.0, verbose_name='Уровень громкости (LUFS)')
    checksum = models.CharField(max_length=64, blank=True, verbose_name='Контрольная сумма')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлен')
    
    class Meta:
        verbose_name = 'Аудиотрек'
        verbose_name_plural = 'Аудиотреки'
    
    def __str__(self):
        return f"{self.id}: {self.title_ru}"

class PointOfInterest(models.Model):
    id = models.CharField(max_length=50, primary_key=True, verbose_name='ID точки')
    name_ru = models.CharField(max_length=200, verbose_name='Название (рус)')
    name_en = models.CharField(max_length=200, blank=True, verbose_name='Название (англ)')
    name_sah = models.CharField(max_length=200, blank=True, verbose_name='Название (якут)')
    
    poi_type = models.CharField(max_length=20, choices=POIType.choices, verbose_name='Тип точки')
    
    # Координаты как обычные FloatField вместо PointField
    longitude = models.FloatField(verbose_name='Долгота')
    latitude = models.FloatField(verbose_name='Широта')
    
    radius = models.PositiveIntegerField(default=100, help_text='Радиус в метрах', verbose_name='Радиус геозоны')
    cooldown_sec = models.PositiveIntegerField(default=7200, verbose_name='Кулдаун (сек)')
    
    audio_track = models.ForeignKey(
        AudioTrack, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name='Аудиотрек'
    )
    
    description_ru = models.TextField(blank=True, verbose_name='Описание (рус)')
    description_en = models.TextField(blank=True, verbose_name='Описание (англ)')
    description_sah = models.TextField(blank=True, verbose_name='Описание (якут)')
    
    opening_hours = models.CharField(max_length=100, blank=True, verbose_name='Часы работы')
    has_parking = models.BooleanField(default=False, verbose_name='Есть парковка')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    priority = models.PositiveIntegerField(default=1, help_text='Приоритет (выше = важнее)', verbose_name='Приоритет')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлена')
    
    class Meta:
        verbose_name = 'Точка интереса'
        verbose_name_plural = 'Точки интереса'
        indexes = [
            models.Index(fields=['poi_type']),
            models.Index(fields=['is_active']),
            models.Index(fields=['longitude', 'latitude']),
        ]
    
    def __str__(self):
        return f"{self.id}: {self.name_ru}"

class Route(models.Model):
    id = models.CharField(max_length=50, primary_key=True, verbose_name='ID маршрута')
    name_ru = models.CharField(max_length=200, verbose_name='Название (рус)')
    name_en = models.CharField(max_length=200, blank=True, verbose_name='Название (англ)')
    name_sah = models.CharField(max_length=200, blank=True, verbose_name='Название (якут)')
    
    # Храним путь как JSON вместо LineString
    path_coordinates = models.JSONField(default=list, verbose_name='Координаты пути')
    
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    
    class Meta:
        verbose_name = 'Маршрут'
        verbose_name_plural = 'Маршруты'
    
    def __str__(self):
        return f"{self.id}: {self.name_ru}"

class RouteWaypoint(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, verbose_name='Маршрут')
    point = models.ForeignKey(PointOfInterest, on_delete=models.CASCADE, verbose_name='Точка')
    order = models.PositiveIntegerField(verbose_name='Порядок')
    
    class Meta:
        verbose_name = 'Точка маршрута'
        verbose_name_plural = 'Точки маршрута'
        ordering = ['route', 'order']
        unique_together = ['route', 'point', 'order']
    
    def __str__(self):
        return f"{self.route.name_ru} - {self.point.name_ru} ({self.order})"

class OfflinePackage(models.Model):
    version = models.CharField(max_length=20, primary_key=True, verbose_name='Версия пакета')
    
    routes_geojson = models.FileField(upload_to='offline/', verbose_name='GeoJSON маршрутов')
    pois_geojson = models.FileField(upload_to='offline/', verbose_name='GeoJSON точек')
    
    total_audio_size = models.PositiveBigIntegerField(verbose_name='Размер аудио (байт)')
    total_tiles_size = models.PositiveBigIntegerField(verbose_name='Размер тайлов (байт)')
    audio_tracks_count = models.PositiveIntegerField(verbose_name='Кол-во аудиотреков')
    pois_count = models.PositiveIntegerField(verbose_name='Кол-во точек')
    
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    
    class Meta:
        verbose_name = 'Офлайн пакет'
        verbose_name_plural = 'Офлайн пакеты'
    
    def __str__(self):
        return f"Офлайн пакет v{self.version}"