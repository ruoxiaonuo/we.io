const chinaMapData = {
    type: 'FeatureCollection',
    features: [
        {
            id: '北京',
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[116.4551, 40.2539], /* ... 更多坐标点 */]]
            },
            properties: {
                name: '北京'
            }
        },
        {
            id: '天津',
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[117.4219, 39.4189], /* ... 更多坐标点 */]]
            },
            properties: {
                name: '天津'
            }
        },
        // ... 其他省份的数据
    ]
};

// 注册地图数据
echarts.registerMap('china', {
    type: 'FeatureCollection',
    features: chinaMapData.features
}); 