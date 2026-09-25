import { Size } from '@/core/products/interfaces/product.interface'
import ProductImages from '@/presentation/products/components/ProductImages'
import { useProduct } from '@/presentation/products/hooks/useProduct'
import { useCameraStore } from '@/presentation/store/useCameraStore'
import MenuIconButton from '@/presentation/theme/components/menu-icon-button'
import ThemedButton from '@/presentation/theme/components/themed-button'
import ThemedButtonGroup from '@/presentation/theme/components/themed-button-group'
import ThemedTextInput from '@/presentation/theme/components/themed-text-input'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import { Redirect, router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Formik } from 'formik'
import { useEffect } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'

const ProductScreen = () => {
    const navigation = useNavigation()
    const { id } = useLocalSearchParams()
    const { productQuery, productMutation } = useProduct(`${id}`)
    const { selectedImages, clearImages } = useCameraStore()

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <MenuIconButton icon='camera-outline' onPress={() => router.push('/camera')} />
        })
    }, [])

    useEffect(() => {
        return () => {
            clearImages()
        }
    }, [])

    useEffect(() => {
        if (productQuery.data) {
            navigation.setOptions({ title: productQuery.data.title })
        }
    }, [productQuery.data])

    if (productQuery.isLoading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={30} />
            </ThemedView>
        )
    }

    if (!productQuery.data) {
        return <Redirect href='/(products-app)/(home)' />
    }

    const product = productQuery.data



    return (
        <Formik
            initialValues={product}
            onSubmit={(productLike) => productMutation.mutate({ ...productLike, images: [...product.images, ...selectedImages] })}
        >
            {({ values, handleSubmit, handleChange, setFieldValue }) => (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView refreshControl={<RefreshControl refreshing={productQuery.isFetching} onRefresh={async () => {
                        await productQuery.refetch()
                    }} />}>
                        <ProductImages images={[...product.images, ...selectedImages]} />
                        <ThemedView style={{ marginHorizontal: 10, marginTop: 10 }}>
                            <ThemedTextInput
                                placeholder='title'
                                style={{ marginVertical: 5 }}
                                value={values.title}
                                onChangeText={handleChange('title')}
                            />
                            <ThemedTextInput
                                placeholder='slug'
                                style={{ marginVertical: 5 }}
                                value={values.slug}
                                onChangeText={handleChange('slug')}
                            />
                            <ThemedTextInput
                                placeholder='description'
                                style={{ marginVertical: 5 }}
                                multiline
                                numberOfLines={5}
                                value={values.description}
                                onChangeText={handleChange('description')}
                            />
                        </ThemedView>
                        <ThemedView style={{ marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', gap: 10 }}>
                            <ThemedTextInput
                                placeholder='price'
                                containerstyle={{ flex: 1 }}
                                value={values.price.toString()}
                                onChangeText={handleChange('price')}
                            />
                            <ThemedTextInput
                                placeholder='inventory'
                                containerstyle={{ flex: 1 }}
                                value={values.stock.toString()}
                                onChangeText={handleChange('stock')}
                            />
                        </ThemedView>
                        <ThemedView style={{ marginHorizontal: 10 }}>
                            <ThemedButtonGroup
                                options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']}
                                selectedOptions={values.sizes}
                                onSelect={(selectedOption) => {
                                    const newSizes = values.sizes.includes(selectedOption as Size) ?
                                        values.sizes.filter(s => s !== selectedOption)
                                        : [...values.sizes, selectedOption]
                                    setFieldValue('sizes', newSizes)
                                }}
                            />
                            <ThemedButtonGroup
                                options={['kid', 'men', 'women', 'unisex']}
                                selectedOptions={[values.gender]}
                                onSelect={(selectedOption) => setFieldValue('gender', selectedOption)}
                            />
                        </ThemedView>
                        <ThemedView>
                            <ThemedButton
                                onPress={() => handleSubmit()}
                                icon='save-outline'
                                style={{ marginHorizontal: 10, marginBottom: 50, marginTop: 20 }}
                            >
                                save
                            </ThemedButton>
                        </ThemedView>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}

        </Formik>
    )
}

export default ProductScreen