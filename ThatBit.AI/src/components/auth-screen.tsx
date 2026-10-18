import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'sign-in' | 'sign-up';
type Integration = {
  name: string;
  mark: string;
  color: string;
  background: string;
};

const integrations: Integration[] = [
  { name: 'Photos', mark: '▧', color: '#d9dcdf', background: '#191c20' },
  { name: 'Gmail', mark: 'M', color: '#f26b62', background: '#211817' },
  { name: 'Calendar', mark: '31', color: '#75a9ff', background: '#151e2d' },
  { name: 'Meet', mark: '▶', color: '#70d6a0', background: '#14231c' },
  { name: 'GitHub', mark: 'GH', color: '#f2f3f4', background: '#1a1b1d' },
];

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === 'sign-up';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  function handleSubmit() {
    setNotice(
      isSignUp
        ? 'Account creation is not connected yet. Supabase authentication can be added next.'
        : 'Sign-in is not connected yet. Supabase authentication can be added next.'
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Text style={styles.brandGlyph}>t</Text>
              </View>
              <Text style={styles.brandName}>thatbit</Text>
              <Text style={styles.brandLabel}>PRIVATE WORKSPACE</Text>
            </View>

            <View style={styles.integrations}>
              <Text style={styles.integrationCaption}>YOUR TOOLS, IN ONE PLACE</Text>
              <View style={styles.integrationRow}>
                {integrations.map((integration) => (
                  <View key={integration.name} style={styles.integration}>
                    <View
                      style={[
                        styles.integrationIcon,
                        { backgroundColor: integration.background },
                      ]}>
                      <Text style={[styles.integrationMark, { color: integration.color }]}>
                        {integration.mark}
                      </Text>
                    </View>
                    <Text style={styles.integrationName}>{integration.name}</Text>
                  </View>
                ))}
              </View>

              <View accessibilityElementsHidden style={styles.reflection}>
                <View style={styles.reflectionRow}>
                  {integrations.map((integration) => (
                    <View
                      key={integration.name}
                      style={[
                        styles.reflectionIcon,
                        { backgroundColor: integration.background },
                      ]}>
                      <Text
                        style={[
                          styles.reflectionMark,
                          { color: integration.color },
                        ]}>
                        {integration.mark}
                      </Text>
                    </View>
                  ))}
                </View>
                <View pointerEvents="none" style={styles.reflectionFade} />
              </View>
              <View style={styles.waterline} />
            </View>

            <View style={styles.form}>
              <View style={styles.headingBlock}>
                <Text style={styles.heading}>{isSignUp ? 'Make room for more.' : 'Welcome back.'}</Text>
                <Text style={styles.subheading}>
                  {isSignUp
                    ? 'One calm place for everything you work on.'
                    : 'Your work, right where you left it.'}
                </Text>
              </View>

              <View style={styles.fields}>
                {isSignUp && (
                  <TextInput
                    accessibilityLabel="Name"
                    autoCapitalize="words"
                    autoComplete="name"
                    placeholder="Name"
                    placeholderTextColor="#777b82"
                    returnKeyType="next"
                    style={styles.input}
                  />
                )}
                <TextInput
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#777b82"
                  returnKeyType="next"
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
                <TextInput
                  accessibilityLabel="Password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  onChangeText={setPassword}
                  onSubmitEditing={handleSubmit}
                  placeholder="Password"
                  placeholderTextColor="#777b82"
                  returnKeyType="done"
                  secureTextEntry
                  style={styles.input}
                  textContentType={isSignUp ? 'newPassword' : 'password'}
                  value={password}
                />
              </View>

              {notice ? <Text style={styles.notice}>{notice}</Text> : null}

              <Pressable
                accessibilityRole="button"
                onPress={handleSubmit}
                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                <Text style={styles.submitLabel}>{isSignUp ? 'Create account' : 'Sign in'}</Text>
              </Pressable>

              <View style={styles.switchRow}>
                <Text style={styles.switchPrompt}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <Link href={isSignUp ? '/' : '/sign-up'} asChild>
                  <Pressable accessibilityRole="link" onPress={() => setNotice('')}>
                    <Text style={styles.switchLink}>{isSignUp ? 'Sign in' : 'Sign up'}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
            <Text style={styles.footer}>A little more connected. A lot less scattered.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050607',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 44,
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGlyph: {
    color: '#090a0b',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  brandName: {
    color: '#f0f1f2',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  brandLabel: {
    color: '#62666d',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginLeft: 'auto',
  },
  integrations: {
    alignItems: 'center',
    marginBottom: 37,
  },
  integrationCaption: {
    color: '#777b82',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.8,
    marginBottom: 17,
  },
  integrationRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  integration: {
    alignItems: 'center',
    gap: 9,
    width: 54,
  },
  integrationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  integrationMark: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -1,
  },
  integrationName: {
    color: '#858991',
    fontSize: 10,
  },
  reflection: {
    height: 45,
    width: '100%',
    marginTop: 7,
    overflow: 'hidden',
  },
  reflectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  reflectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.26,
    transform: [{ scaleY: -1 }],
  },
  reflectionMark: {
    fontSize: 18,
    fontWeight: '700',
  },
  reflectionFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    bottom: 0,
    backgroundColor: '#050607',
    opacity: 0.78,
  },
  waterline: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(207,220,235,0.1)',
  },
  form: {
    gap: 22,
  },
  headingBlock: {
    gap: 8,
    marginBottom: 5,
  },
  heading: {
    color: '#f2f3f4',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '500',
    letterSpacing: -1.2,
  },
  subheading: {
    color: '#888c93',
    fontSize: 14,
    lineHeight: 21,
  },
  fields: {
    gap: 11,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#24272c',
    borderRadius: 16,
    backgroundColor: '#0d0f11',
    paddingHorizontal: 17,
    color: '#f2f3f4',
    fontSize: 14,
  },
  notice: {
    marginTop: -10,
    color: '#b8c2ce',
    fontSize: 12,
    lineHeight: 18,
  },
  submitButton: {
    minHeight: 54,
    borderRadius: 28,
    backgroundColor: '#eef0f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  submitLabel: {
    color: '#0a0b0c',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.82,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: -7,
  },
  switchPrompt: {
    color: '#858991',
    fontSize: 13,
  },
  switchLink: {
    color: '#f1f2f3',
    fontSize: 13,
    fontWeight: '600',
    padding: 4,
  },
  footer: {
    color: '#555960',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 39,
  },
});
