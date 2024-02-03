import {useSelector} from "react-redux";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";
import {Textarea} from "../ui/textarea.tsx";
import {useUpdateUserMutation} from "../../services/api/userApi.js";
import {useEffect, useState} from "react";
import ProfileCard from "./ProfileCard.js";

const titles = ['-','Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];

const EditProfile = () => {
    const userData = useSelector(state => state.authSlice.userInfo);

    // Add a loading state to prevent the form from rendering before the user data is fetched
    const [isLoading, setIsLoading] = useState(!userData);


    const [updateUser, {isLoading: isUpdating}] = useUpdateUserMutation();

    const [formValues, setFormValues] = useState(userData);


    const profileFormSchema = z.object({
        firstName: z.string().min(1, {message: 'First name cannot be empty'}),
        lastName: z.string().min(1, {message: 'Last name cannot be empty'}),
        title: z.enum(titles, {message: 'Please select a valid title'}).or(z.null()).or(z.undefined()).or(z.literal('')),
        website: z.string().url({message:"Please enter a valid URL"}).or(z.null()).or(z.undefined()).or(z.literal('')),
        //phone: z.string().min(10, {message: 'Please enter a valid phone number'}),
        dob: z.date().or(z.null()).or(z.undefined()),
        bio: z.string().min(10, {message: 'Please enter a valid bio consisting of at least 10 characters'}).or(z.null()).or(z.undefined()).or(z.literal('')),
        company: z.string().or(z.null()).or(z.undefined()).or(z.literal('')),
    })

    const profileForm = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            title: userData.title,
            website: userData.website,
            bio: userData.bio,
            //phone: userData.phone || '',
            dob: userData.dob,
            company: userData.company,
        },
    })

    useEffect(() => {
        // When userData updates and is not undefined, set loading to false
        if (userData) {
            setIsLoading(false);
            profileForm.reset({
                firstName: userData.firstName,
                lastName: userData.lastName,
                title: userData.title,
                website: userData.website,
                bio: userData.bio,
                dob: userData.dob,
                company: userData.company,
            });
        }
    }, [userData, profileForm]);



    useEffect(() => {
        setFormValues(profileForm.getValues())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[profileForm.getValues()])


    const onSubmit = (zodValues) => {
        updateUser(zodValues)
    }

    if (isLoading) {
        <div>
            Loading...
        </div>
    }

    return (
        <div className="mt-2 flex flex-col md:flex-row gap-6">
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmit)} className="flex flex-col gap-y-3 w-[100%] ">
                    <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem >
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({field}) => (
                            <FormItem >
                                <FormLabel>Family Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row gap-x-2">
                        <FormField
                            control={profileForm.control}
                            name="title"
                            render={({field}) => (
                                <FormItem className="w-[50%]">
                                    <FormLabel>Title</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {titles.map((item, index) => (
                                                <SelectItem key={index} value={item}>{item}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="dob"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Date Of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" disabled {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={profileForm.control}
                        name="company"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Your Company</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea name="bio" className="resize-none" placeholder="Tell us about yourself" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={profileForm.control}
                        name="website"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="dark" isLoading={isUpdating}>
                        Update
                    </Button>
                </form>
            </Form>
            <ProfileCard user={formValues} />
        </div>
    )
}

export default EditProfile;