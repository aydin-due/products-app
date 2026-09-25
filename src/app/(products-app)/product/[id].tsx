import { Size } from '@/core/products/interfaces/product.interface'
import ProductImages from '@/presentation/products/components/ProductImages'
import { useProduct } from '@/presentation/products/hooks/useProduct'
import ThemedButton from '@/presentation/theme/components/themed-button'
import ThemedButtonGroup from '@/presentation/theme/components/themed-button-group'
import ThemedTextInput from '@/presentation/theme/components/themed-text-input'
import { ThemedView } from '@/presentation/theme/components/themed-view'
import Ionicons from '@react-native-vector-icons/ionicons'
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router'
import { Formik } from 'formik'
import { useEffect } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

const ProductScreen = () => {
    const navigation = useNavigation()
    const { id } = useLocalSearchParams()
    const { productQuery, productMutation } = useProduct(`${id}`)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <Ionicons name='camera-outline' size={25} />
        })
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
            onSubmit={(productLike) => productMutation.mutate(productLike)}
        >
            {({ values, handleSubmit, handleChange, setFieldValue }) => (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView>
                        <ProductImages images={values.images} />
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