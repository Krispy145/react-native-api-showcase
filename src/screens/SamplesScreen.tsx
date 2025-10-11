import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '../shared/api';
import { notify } from '../shared/notify';

type Sample = { id?: string|number; url?: string; label?: string|number|boolean; score?: number };

export default function SamplesScreen() {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Sample[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/phishing/samples');
      const arr = Array.isArray(data) ? data : data?.items || [];
      setItems(arr);
      notify(`Loaded ${arr.length} samples`);
    } catch (e: any) {
      notify(e?.message ?? 'Failed to load samples', 'Error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading && <ActivityIndicator />}
      <FlatList
        data={items}
        keyExtractor={(item, idx) => String(item.id ?? idx)}
        renderItem={({ item, index }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>#{String(item.id ?? index)}</Text>
            <Text numberOfLines={1}>{item.url || '-'}</Text>
            <Text>Label: {String(item.label ?? '-')}  Score: {typeof item.score === 'number' ? item.score.toFixed(3) : '-'}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: '#666' }}>No data yet. Wire /phishing/samples.</Text> : null}
      />
      <TouchableOpacity
        onPress={load}
        style={{ position: 'absolute', right: 16, bottom: 24, backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24 }}
      >
        <Text style={{ color: 'white' }}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
}