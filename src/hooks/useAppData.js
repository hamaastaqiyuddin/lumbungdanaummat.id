import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { defaultPrograms, defaultNews } from '../data/defaultData';

export const useAppData = () => {
    // Fetch Programs
    const {
        data: programsData,
        isLoading: isLoadingPrograms,
        error: errorPrograms
    } = useQuery({
        queryKey: ['programs'],
        queryFn: async () => {
            try {
                if (!isSupabaseConfigured) {
                    const local = localStorage.getItem('ldu_programs');
                    return local ? JSON.parse(local) : defaultPrograms;
                }

                const { data, error } = await supabase
                    .from('programs')
                    .select('*, projects (*)')
                    .order('id', { ascending: true });

                if (error) throw error;
                // Map description -> desc for local compatibility
                const mapped = (data || []).map(p => ({
                    ...p,
                    desc: p.description,
                    projects: (p.projects || []).map(prj => ({
                        ...prj,
                        daysLeft: prj.days_left
                    }))
                }));
                return mapped.length > 0 ? mapped : defaultPrograms;
            } catch (err) {
                console.error('Error fetching programs:', err);
                const local = localStorage.getItem('ldu_programs');
                return local ? JSON.parse(local) : defaultPrograms;
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch News
    const {
        data: newsData,
        isLoading: isLoadingNews,
        error: errorNews
    } = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            try {
                if (!isSupabaseConfigured) {
                    const local = localStorage.getItem('ldu_news');
                    return local ? JSON.parse(local) : defaultNews;
                }

                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .order('id', { ascending: false });

                if (error) throw error;
                return data && data.length > 0 ? data : defaultNews;
            } catch (err) {
                console.error('Error fetching news:', err);
                const local = localStorage.getItem('ldu_news');
                return local ? JSON.parse(local) : defaultNews;
            }
        },
        staleTime: 1000 * 60 * 10,
    });

    return {
        programsData,
        newsData,
        isLoading: isLoadingPrograms || isLoadingNews,
        error: errorPrograms || errorNews,
    };
};
