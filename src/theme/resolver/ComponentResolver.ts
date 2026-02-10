import { ComponentType as ReactComponentType } from 'react';
import { ComponentType, ComponentVariantMap } from '../registry/types';
import { StandardHeader, LegacyHeader, HeaderSkeleton, WhiteShineHeader } from '../../components/headers';
import { ModernProfile, LegacyProfile, ProfileSkeleton } from '../../components/profiles';


const COMPONENT_MAP = {
    Header: {
        Standard: StandardHeader,
        Legacy: LegacyHeader,
        Minimal: StandardHeader,
        WhiteShine: WhiteShineHeader,
    },
    Profile: {
        Modern: ModernProfile,
        Legacy: LegacyProfile,
    },
    // Other component variants (placeholders for now)
    ProductCard: {
        Zeraki: null as any,
        Classic: null as any,
        Grid: null as any,
        List: null as any,
    },
    Navigation: {
        BottomTabs: null as any,
        Drawer: null as any,
        None: null as any,
    },
    OrderList: {
        Detailed: null as any,
        Compact: null as any,
        Card: null as any,
    },
    Cart: {
        Standard: null as any,
        Minimal: null as any,
    },
};

/**
 * Skeleton Component Map
 * Loading states for each component type
 */
const SKELETON_MAP = {
    Header: HeaderSkeleton,
    Profile: ProfileSkeleton,
    ProductCard: null as any,
    Navigation: null as any,
    OrderList: null as any,
    Cart: null as any,
};

/**
 * Get component implementation for variant
 * 
 * @param componentType - Type of component (e.g., 'Header')
 * @param variant - Variant name (e.g., 'Standard')
 * @returns Component implementation or null if not found
 */
export function getComponentImplementation<T extends ComponentType>(
    componentType: T,
    variant: ComponentVariantMap[T]
): ReactComponentType<any> | null {
    const variantMap = COMPONENT_MAP[componentType];
    if (!variantMap) {
        console.warn(`Component type '${componentType}' not found in component map`);
        return null;
    }

    const component = (variantMap as any)[variant];
    if (!component) {
        console.warn(`Component variant '${variant}' for type '${componentType}' not found`);
        return null;
    }

    return component as ReactComponentType<any>;
}

/**
 * Get skeleton component for loading state
 * 
 * @param componentType - Type of component
 * @returns Skeleton component or null
 */
export function getSkeletonComponent<T extends ComponentType>(
    componentType: T
): ReactComponentType<any> | null {
    return SKELETON_MAP[componentType] || null;
}

/**
 * Export component map for external use if needed
 */
export { COMPONENT_MAP, SKELETON_MAP };
